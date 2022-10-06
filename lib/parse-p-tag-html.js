'use babel';

import ParsePTagHtmlView from './parse-p-tag-html-view';
import RemovePTag from './remove-p-tag';
import { CompositeDisposable } from 'atom';

export default {

  parsePTagHtmlView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.parsePTagHtmlView = new ParsePTagHtmlView(state.parsePTagHtmlViewState);
    this.RemovePTag = new RemovePTag();
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.parsePTagHtmlView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'parse-p-tag-html:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.parsePTagHtmlView.destroy();
  },

  serialize() {
    return {
      parsePTagHtmlViewState: this.parsePTagHtmlView.serialize()
    };
  },

  toggle() {
      let editor;
      if (editor = atom.workspace.getActiveTextEditor()) {
        let htmlCode = editor.getSelectedText();
        let resultHtmlCode = this.RemovePTag.getParsedPTagCode(htmlCode);
        console.log(resultHtmlCode);
        editor.insertText(resultHtmlCode);
      }
  }

};
