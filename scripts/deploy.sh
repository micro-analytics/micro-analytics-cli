cd packages/micro-analytics-cli

rm -rf node_modules
npm install

echo "Installing now-pipeline"
npm install -g now-pipeline@latest

echo "Prune old instances"
now-pipeline-prune > /dev/null

echo "Deploy and alias new instance"
now-pipeline --alias demo.micro-analytics.io --test "npm run test-now-deployment"
#now-pipeline --alias demo.micro-analytics.io --test "true"

