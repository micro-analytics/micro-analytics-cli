echo "Installing now-pipeline"
npm install -g now-pipeline

echo "Prune old instances"
now-pipeline-prune

echo "Deploy and alias new instance"
now-pipeline --test 'curl --fail $NOW_URL/test?inc=false' --alias internal.micro-analytics.io

