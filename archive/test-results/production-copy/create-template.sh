gcloud config configurations activate logan-staging

gcloud compute snapshots delete loadtest-production-copy-snapshot --quiet
gcloud compute disks snapshot loadtest-production --snapshot-names loadtest-production-copy-snapshot --zone us-central1-a
gcloud compute disks delete loadtest-production-copy-disk --quiet
gcloud compute disks create loadtest-production-copy-disk --source-snapshot loadtest-production-copy-snapshot --zone us-central1-a
gcloud compute images delete loadtest-production-copy-image --quiet
gcloud compute images create loadtest-production-copy-image --source-disk loadtest-production-copy-disk --source-disk-zone us-central1-a
gcloud compute instance-templates delete loadtest-production-copy-template --quiet
gcloud compute instance-templates create loadtest-production-copy-template --image loadtest-production-copy-image --machine-type n1-standard-2 --tags "loadtest-production-copy" --metadata "app=spaces-production-copy,ssh-keys=tjia:ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC8DFFwkeDSIqhHY3eyAtTHdJPS8Bdai5TWwblLHx988sexvSl6zkBtF52RP8dbxtHc+H7OSr1tX12qPFE46tnyoc4YG1ZnkebwQ6h/nEtfluk6csJA4r6HykaNyw7SR3YAfm6Lh2acZmwPUDCA8+e26RtAAW5TuNCqHImoWIEozf5hgTs8GLRvpDSWoilyxwyB6uqyG+vte8ixJipYJzrwqurpXPU4T5bpNvXA9ja4mmSD8fLwxIsPEADfkcqHqxJUPIy6Wonfcl2QhnVg3/OWuIpBuur/SoaCdAkh77/pgiQE9Hvgdgn7g/9cTwmaGPk/LoKQ23RSK7TflPGN4cGN tjia@mac-pro"
