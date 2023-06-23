FROM codercom/code-server
USER coder
COPY --chown=coder:coder settings.json /home/coder/.local/share/code-server/User/settings.json
COPY --chown=coder:coder setup.sh /entrypoint.d/setup.sh

RUN sudo sh -c "curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs" && \
    sudo apt update && \
    sudo apt install -y wget && \
    sudo apt install -y icu-devtools && \
    sudo apt install -y iputils-ping net-tools traceroute && \
    sudo npm install -g live-server && \
    code-server --install-extension ecmel.vscode-html-css && \
    code-server --install-extension esbenp.prettier-vscode && \
    code-server --install-extension george-alisson.html-preview-vscode && \
    code-server --install-extension mohd-akram.vscode-html-format && \
    code-server --install-extension mohsen1.prettify-json && \
    code-server --install-extension PKief.material-icon-theme && \
    code-server --install-extension quicktype.quicktype && \
    code-server --install-extension vscode-icons-team.vscode-icons && \
    code-server --install-extension dbaeumer.vscode-eslint
