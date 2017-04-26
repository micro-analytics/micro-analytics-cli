echo "Installing now-pipeline"
npm install -g MiniGod/now-pipeline#state-building

echo "Prune old instances"
now-pipeline-prune

echo "Deploy and alias new instance"
now-pipeline --alias demo.micro-analytics.io --test "npm run test-now-deployment"

