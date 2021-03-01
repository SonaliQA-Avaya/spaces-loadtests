import { Rate, Counter } from "k6/metrics";

export const errorRate = new Rate("errors")
export const wsErrorRate = new Rate("ws_errors")
export const markreadErrorRate = new Rate("markread_errors")

export const joinCounter = new Counter("joins")
export const dashboardCounter = new Counter("dashboards")
export const presenceEventReceived = new Counter("presence_events_received")
export const presenceEventSent = new Counter("presence_events_sent")

export const chatMsgSent = new Counter("chat_msg_sent")
export const chatMsgReceived = new Counter("chat_msg_received")
