const vscode = require("vscode");
const fs = require("fs");
const path = require('path');


function createFile(uri, content) {
  const wsedit = new vscode.WorkspaceEdit();
  const pathInfo = path.parse(uri.fsPath);
  
  const filePath = vscode.Uri.file(pathInfo.dir + `/${pathInfo.name}.webp`);
  wsedit.createFile(filePath, { ignoreIfExists: true });
  
  vscode.workspace.applyEdit(wsedit);
  vscode.window.showInformationMessage(
    "Created a new " + filePath.toString()
  );

  try {
    console.log(filePath.fsPath);
    const binaryData = Buffer.from(content, 'base64');
    fs.writeFileSync(filePath.fsPath, binaryData, { flag: "w" });
  } catch (error) {
    vscode.window.showErrorMessage("Error writing to file: " + error.message);
  }
}

module.exports = {
  createFile,
};
