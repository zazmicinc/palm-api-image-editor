const vscode = require("vscode");
const fs = vscode.workspace.fs;
const path = require("path");
const FileUtils = require("./utils/FileUtils");
const ImageEditor = require("./utils/ImageEditor");

const extensionToMimeType = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
};

async function convertToWebP(uri) {
  try {
    // Read the image file content
    const pathInfo = path.parse(uri.fsPath);
    const filePath = vscode.Uri.file(uri.fsPath);
    const imageContent = await fs.readFile(filePath);

    const mimeType =
      extensionToMimeType[pathInfo.ext.toLowerCase()] ||
      "application/octet-stream";

    if (imageContent !== undefined) {
      let webpImage = await ImageEditor.convertToWebP(imageContent, mimeType);
      if (webpImage === undefined) {
        return;
      }
      FileUtils.createFile(uri, webpImage);
    }
  } catch (error) {
    vscode.window.showErrorMessage("Error converting image: " + error);
  }
}

function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "palm-api-image-editor.ToWebP",
    (uri) => {
      if (uri) {
        return new Promise((resolve) => {
          vscode.window.withProgress(
            {
              location: vscode.ProgressLocation.Notification,
              title: "Converting image ...",
              cancellable: true,
            },
            async (progress, token) => {
              await convertToWebP(uri);
              resolve();
            }
          );
        });
      }
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;
