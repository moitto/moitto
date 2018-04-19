# Moitto

Moitto is a decentralized app browser for Steem. With Moitto you can discover useful apps based on Steem and enjoy apps right away without the hassle of installation. Moitto has a Steem wallet built in, so apps can interact with your wallet when they need it.

Moitto is an iOS and Android based mobile app. Moitto was developed with jamkit, an excellent app creation tool. With the cool feature of jamkit, you can run Moitto on your Mac without real devices. Our goal is launching Moitto on the App Store or Google Play in near future. 

## How to run

If you are a developer, you can easily run Moitto on your Mac. After installing jamkit, just download or clone the source files into your Mac and then run it using the jamkit command-line tool. If you are not familiar with jamkit or if jamkit is not already installed, please follow the instructions.

### Install node.js and npm using Homebrew

    brew update
    brew install node

### Install jamcmd with npm

    sudo npm install -g jamcmd

### Install Xcode from the Mac App Store

Please visit https://itunes.apple.com/us/app/xcode/id497799835?mt=12

### Install Xcode command line tools

    xcode-select --install

### Download or clone the source files

    git clone https://github.com/moitto/moitto.git

### Run Moitto using jamkit

    cd moitto
    jamkit run

