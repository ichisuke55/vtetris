function doGet() {
    const htmlOutput = HtmlService.createTemplateFromFile("index").evaluate();
    return htmlOutput;
}
