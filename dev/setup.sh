#!/bin/bash
GITREPO="https://github.com/ichisuke55/vtetris.git"
echo "Cloning git repository"
cd /home/coder
if [ ! -d $HOME/vtetris ]; then
    echo "git clone not detected."
    echo "cloning from git and installing npm"
    until git clone $GITREPO
    do
        echo "git clone failed. Please check permissions."
        sleep 10
    done

    echo "Installing NPM package"
    cd vtetris && npm install

fi
echo "Initialization complete"
