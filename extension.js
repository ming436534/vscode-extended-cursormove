// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require("vscode");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function applyEdit(vsEditor, coords, content) {
  var vsDocument = getDocument(vsEditor);
  var edit = setEditFactory(vsDocument._uri, coords, content);
  vscode.workspace.applyEdit(edit);
}
function positionFactory(line, char) {
  return new vscode.Position(line, char);
}
function rangeFactory(start, end) {
  return new vscode.Range(start, end);
}
function textEditFactory(range, content) {
  return new vscode.TextEdit(range, content);
}
function workspaceEditFactory() {
  return new vscode.WorkspaceEdit();
}
function getDocument(vsEditor) {
  return typeof vsEditor._documentData !== 'undefined' ? vsEditor._documentData : vsEditor._document
}
function editFactory(coords, content) {
  var start = positionFactory(coords.start.line, coords.start.char);
  var end = positionFactory(coords.end.line, coords.end.char);
  var range = rangeFactory(start, end);

  return textEditFactory(range, content);
}
function setEditFactory(uri, coords, content) {
  var workspaceEdit = workspaceEditFactory();
  var edit = editFactory(coords, content);
  workspaceEdit.set(uri, [edit]);
  return workspaceEdit;
}
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  console.log("Congratulations, your extension 'extended-cursormove' is now active!");

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("extension.extendedCursorMove.cursorHome", function (editor, edit) {
      vscode.commands.executeCommand("cursorMove", {
        to: "wrappedLineStart",
        by: "line",
        select: false,
        value: 1
      });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("extension.extendedCursorMove.cursorHomeSelect", function (editor, edit) {
      vscode.commands.executeCommand("cursorMove", {
        to: "wrappedLineStart",
        by: "line",
        select: true,
        value: 1
      });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("extension.extendedCursorMove.cursorLineFirstNonWhitespaceCharacter", function (editor, edit) {
      vscode.commands.executeCommand("cursorMove", {
        to: "wrappedLineFirstNonWhitespaceCharacter",
        by: "line",
        select: false,
        value: 1
      });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("extension.extendedCursorMove.cursorLineFirstNonWhitespaceCharacterSelect", function (editor, edit) {
      vscode.commands.executeCommand("cursorMove", {
        to: "wrappedLineFirstNonWhitespaceCharacter",
        by: "line",
        select: true,
        value: 1
      });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("extension.extendedCursorMove.deleteLeft", function (editor, edit) {
      console.log(editor);
      var selections = editor._selections;
      var coords = {
        start: {},
        end: {}
      };
      for (var i = 0; i < selections.length; i++) {
        var lineNum = selections[i].active.line;
        var charNum = selections[i].active.character;
        var doc = getDocument(editor);
        var line = doc._lines[lineNum];
        if (selections[i].start.line != selections[i].end.line) {
          coords.start.line = selections[i].start.line;
          coords.end.line = selections[i].end.line;
          coords.start.char = 0;
          coords.end.char = doc._lines[coords.end.line].length;
          applyEdit(editor, coords, '');
        } else {
          if (charNum != 0) {
            var firstChar = line.search(/\S/i);
            if (firstChar != -1 && firstChar < charNum) { //there are some non-whitespace chars and the cursor position is at the right of the first non-white space character, delete all left character execpt indent 
              coords.start.line = lineNum;
              coords.end.line = lineNum;
              coords.start.char = firstChar;
              coords.end.char = charNum;
            } else {
              coords.start.line = lineNum;
              coords.end.line = lineNum;
              coords.start.char = 0;
              coords.end.char = charNum;
            }
            console.log(coords);
            applyEdit(editor, coords, '');
          }
        }
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("extension.extendedCursorMove.deleteRight", function (editor, edit) {
      for (var i = 0; i < editor._selections.length; i++) {
        var lineNum = editor._selections[0].active.line;
        var charNum = editor._selections[0].active.character;
        var doc = getDocument(editor);
        var line = doc._lines[lineNum];
        if (charNum != 0) {
          var firstChar = line.search(/\S/i);
          var coords = {
            start: {},
            end: {}
          };
          coords.start.line = lineNum;
          coords.end.line = lineNum;
          coords.start.char = charNum;
          coords.end.char = line.length;
          console.log(coords);
          applyEdit(editor, coords, '');
        }
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("extension.extendedCursorMove.cursorEnd", function (editor, edit) {
      vscode.commands.executeCommand("cursorMove", {
        to: "wrappedLineEnd",
        by: "line",
        select: false,
        value: 1
      });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("extension.extendedCursorMove.cursorEndSelect", function (editor, edit) {
      vscode.commands.executeCommand("cursorMove", {
        to: "wrappedLineEnd",
        by: "line",
        select: true,
        value: 1
      });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("extension.extendedCursorMove.cursorLineLastNonWhitespaceCharacter", function (editor, edit) {
      vscode.commands.executeCommand("cursorMove", {
        to: "wrappedLineLastNonWhitespaceCharacter",
        by: "line",
        select: false,
        value: 1
      });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("extension.extendedCursorMove.cursorLineLastNonWhitespaceCharacterSelect", function (editor, edit) {
      vscode.commands.executeCommand("cursorMove", {
        to: "wrappedLineLastNonWhitespaceCharacter",
        by: "line",
        select: true,
        value: 1
      });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("extension.extendedCursorMove.cursorTopLeft", function (editor, edit) {
      vscode.commands.executeCommand("cursorMove", {
        to: "viewPortTop",
        by: "line",
        select: false,
        value: 1
      });
      vscode.commands.executeCommand("extension.extendedCursorMove.cursorHome");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("extension.extendedCursorMove.cursorTopLeftSelect", function (editor, edit) {
      vscode.commands.executeCommand("cursorMove", {
        to: "viewPortTop",
        by: "line",
        select: true,
        value: 1
      });
      vscode.commands.executeCommand("extension.extendedCursorMove.cursorHomeSelect");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("extension.extendedCursorMove.cursorBottomRight", function (editor, edit) {
      vscode.commands.executeCommand("cursorMove", {
        to: "viewPortBottom",
        by: "line",
        select: false,
        value: 1
      });
      vscode.commands.executeCommand("extension.extendedCursorMove.cursorEnd");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("extension.extendedCursorMove.cursorBottomRightSelect", function (editor, edit) {
      vscode.commands.executeCommand("cursorMove", {
        to: "viewPortBottom",
        by: "line",
        select: true,
        value: 1
      });
      vscode.commands.executeCommand("extension.extendedCursorMove.cursorEndSelect");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("extension.extendedCursorMove.centerCursorInView", function (editor, edit) {
      vscode.commands.executeCommand("revealLine", {
        lineNumber: editor.selection.anchor.line,
        at: "center"
      });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("extension.extendedCursorMove.moveCursorToView", function (editor, edit) {
      vscode.commands.executeCommand("cursorMove", {
        to: "viewPortCenter",
        by: "line",
        select: !editor.selection.isEmpty,
        value: 1
      });
      editor.selection.isEmpty ?
        vscode.commands.executeCommand("extension.extendedCursorMove.cursorHome") :
        vscode.commands.executeCommand("extension.extendedCursorMove.cursorHomeSelect");
    })
  );

}
exports.activate = activate;
