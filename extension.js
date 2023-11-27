const vscode = require("vscode");
const fs = vscode.workspace.fs;
const path = require("path");
const FileUtils = require("./utils/FileUtils");
const ImageEditor = require("./utils/ImageEditor");

const funProgressTitles = [
  "Magic in the Making...",
  "Cracking the Code Eggs 🥚",
  "Weaving the Code Spells ✨",
  "Turning Code into Gold ✨",
  "Unleashing the Code Genie 🧞",
  "Flipping Code Pancakes 🥞",
  "Sculpting the Digital Clay 🎨",
  "Converting Pixels to Poems ✍️",
  "Cooking up Some Code Delights 🍳",
  "Transforming 1s and 0s 🌌",
];

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
      FileUtils.createFile(uri, webpImage, "", ".webp");
    }
  } catch (error) {
    vscode.window.showErrorMessage("Error converting image: " + error);
  }
}

async function resize(uri, width, height) {
  try {
    // Read the image file content
    const pathInfo = path.parse(uri.fsPath);
    const filePath = vscode.Uri.file(uri.fsPath);
    const imageContent = await fs.readFile(filePath);

    const mimeType =
      extensionToMimeType[pathInfo.ext.toLowerCase()] ||
      "application/octet-stream";

    if (imageContent !== undefined) {
      let image = await ImageEditor.resize(imageContent, width, height, mimeType);
      if (image === undefined) {
        return;
      }
      FileUtils.createFile(uri, image, `_${width}x${height}`, pathInfo.ext.toLowerCase());
    }
  } catch (error) {
    vscode.window.showErrorMessage("Error resizing image: " + error);
  }
}

async function rembg(uri) {
  try {
    // Read the image file content
    const pathInfo = path.parse(uri.fsPath);
    const filePath = vscode.Uri.file(uri.fsPath);
    const imageContent = await fs.readFile(filePath);
    
    const mimeType =
      extensionToMimeType[pathInfo.ext.toLowerCase()] ||
      "application/octet-stream";

    if (imageContent !== undefined) {
      let image = await ImageEditor.rembg(imageContent, mimeType);
      if (image === undefined) {
        return;
      }
      FileUtils.createFile(uri, image, `_no_bg`, pathInfo.ext.toLowerCase());
    }
  } catch (error) {
    vscode.window.showErrorMessage("Error resizing image: " + error);
  }
}

function registerCommandWithProgress(context, commandId) {
  return vscode.commands.registerCommand(commandId, async (uri) => {
    console.log("Command called: ", commandId);
    let width, height;
    if (commandId === "palm-api-image-editor.Resize") {
      width = await vscode.window.showInputBox({
        prompt: "Please define expected width",
        placeHolder: "e.g., 512...",
        value: "512",
      });

      height = await vscode.window.showInputBox({
        prompt: "Please define expected height",
        placeHolder: "e.g., 512...",
        value: "512",
      });
    } 

    const randomTitleIndex = Math.floor(
      Math.random() * funProgressTitles.length
    );
    const randomTitle = funProgressTitles[randomTitleIndex];

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: randomTitle,
        cancellable: true,
      },
      async () => {
        if(commandId === "palm-api-image-editor.ToWebP") {
          await convertToWebP(uri);
        } else if(commandId === "palm-api-image-editor.Resize") { 
          await resize(uri, width, height);
        } else if(commandId === "palm-api-image-editor.RemBg") { 
          await rembg(uri);
        }
    });
  });
}

function activate(context) {
  const commands = [
      { id: "palm-api-image-editor.ToWebP" },
      { id: "palm-api-image-editor.Resize" },
      { id: "palm-api-image-editor.RemBg"},
  ];

  commands.forEach(({ id }) => {
    console.log("Registering command: ", id);
    let disposable = registerCommandWithProgress(context, id);
    context.subscriptions.push(disposable);
  });
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
