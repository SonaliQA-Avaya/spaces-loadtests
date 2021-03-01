-- Resource: http://czerasz.com/2015/07/19/wrk-http-benchmarking-tool-example/
-- Resource: https://github.com/timotta/wrk-scripts/blob/master/multiplepaths.lua

-- Module instantiation
local yaml = require "yaml"

-- Initialize the pseudo random number generator
-- Resource: http://lua-users.org/wiki/MathLibraryTutorial
math.randomseed(os.time())
math.random(); math.random(); math.random()

-- Shuffle array
local charset = {}
-- qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890
for i = 48,  57 do table.insert(charset, string.char(i)) end
for i = 65,  90 do table.insert(charset, string.char(i)) end
for i = 97, 122 do table.insert(charset, string.char(i)) end
function string.random(length)
  -- math.randomseed(os.time())
  if length > 0 then
    return string.random(length - 1) .. charset[math.random(1, #charset)]
  else
    return ""
  end
end

-- Load URL paths from the file
function load_request_objects_from_file(file)
  local lines = {}
  local content

  -- Check if the file exists
  local f=io.open(file,"r")
  if f~=nil then
    content = f:read("*all")
    lines = yaml.load(content)
    io.close(f)
  end

  return lines
end

-- prepare requests list
local preparedRequests = {}
local debug = false
init = function(args)
  local path_file = 'paths.yaml'
  local macro_file = 'macros.yaml'
  for k, v in pairs(args) do
    if k > 0 then
      if v == "debug" then
        debug = true
      else
        path_file = v
      end
    end
  end

  authorization = ""
  macros = {}
  macros.tms = math.floor(math.random() * 1000000000000)
  macros.search = string.random(10)

  -- read macros from file
  extra_macros = load_request_objects_from_file(macro_file)
  for key, value in pairs(extra_macros) do
    if key == "authorization" then
      authorization = value
    else
      macros[key] = value
    end
  end

  -- Load URL paths from file
  paths = load_request_objects_from_file(path_file)

  -- Check if at least one path was found in the file
  if #paths <= 0 then
    print("multiplepaths: No paths found. You have to create a file paths.txt with one path per line")
    os.exit()
  end

  if debug then
    print("multiplepaths: Found " .. #paths .. " paths")
  end

  -- find total weight
  total_weight = 0
  for num, path in pairs(paths) do
    total_weight = total_weight + path.count
  end
  if debug then
    print("total weight " .. total_weight)
  end

  -- generate range for each path
  current_range = 0
  for num, path in pairs(paths) do
    -- prepare method
    local method = 'GET'
    if method ~= nil then
      method = path.method
    end

    -- prepare uri
    local uri = path.uri
    -- replace macros
    for key, value in pairs(macros) do
      uri = string.gsub(uri, ":" .. key, value)
    end

    -- prepare headers
    local headers = {}
    if path.headers ~= nil then
      headers = path.headers
    end
    -- append authorization header
    headers.Authorization = authorization

    -- prepare body
    local body
    if path.body ~= nil then
      body = path.body
      -- replace macros
      for key, value in pairs(macros) do
        body = string.gsub(body, ":" .. key, value)
      end
    end

    local req = {}
    req.request = wrk.format(method, uri, headers, body)
    local chance = path.count / total_weight
    req.range = current_range + chance
    current_range =  current_range + chance

    table.insert(preparedRequests, req)
  end
end

-- find a path
request = function()
  seed = math.random()
  local found
  for num, req in pairs(preparedRequests) do
    if (seed < req.range) then
      found = req
      break
    end
  end

  if debug then
    print("")
    print(">>>>>>>>>> " .. found.request)
  end

  return found.request
end

response = function(status, headers, body)
  if debug then
    print("<<<<<<<<<< status " .. status)
    print(body)
  end
end

