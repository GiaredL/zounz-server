#!/bin/bash

# Update system packages
sudo yum update -y

# Install Node.js and npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 18
nvm use 18

# Install Git
sudo yum install git -y

# Install PM2 globally
npm install -g pm2

# Create application directory
mkdir -p ~/app
cd ~/app

# Clone your repository (replace with your actual repository URL)
git clone <your-repository-url> .

# Install dependencies
npm install

# Create .env file with your environment variables
cat > .env << EOL
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://giaredmati:qJwdRX6O01fKqy3S@brainsmoothies.rbueu.mongodb.net/?retryWrites=true&w=majority&appName=brainsmoothies
SESS_NAME=sid
SESS_SECRET=secret!session
SESS_LIFETIME=86400000
EOL

# Start the application with PM2
pm2 start npm --name "zounz-server" -- start

# Configure PM2 to start on system boot
pm2 startup
pm2 save

# Create uploads directory
mkdir -p uploads
chmod 777 uploads 