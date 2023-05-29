
/* NicEdit - Micro Inline WYSIWYG
 * Copyright 2007-2008 Brian Kirchoff
 *
 * NicEdit is distributed under the terms of the MIT license
 * For more information visit http://nicedit.com/
 * Do not remove this copyright message
 */


canvas = document.getElementById("canvasArea");
ctx = canvas.getContext("2d");
paint = false;            
pen = false;
erase = false;
penSize = 10;
penColor = "red";

clickX = new Array();
clickY = new Array();
clickDrag = new Array();

var bkExtend = function() {
  var args = arguments;
  if (args.length == 1) args = [this, args[0]];
  for (var prop in args[1]) args[0][prop] = args[1][prop];
  return args[0];
};

function bkClass() {}
bkClass.prototype.construct = function() {};
bkClass.extend = function(def) {
  var classDef = function() {
    if (arguments[0] !== bkClass) {
      return this.construct.apply(this, arguments);
    }
  };
  var proto = new this(bkClass);
  bkExtend(proto, def);
  classDef.prototype = proto;
  classDef.extend = this.extend;
  return classDef;
};

var bkElement = bkClass.extend({
  construct: function(elm, d) {
    if (typeof(elm) == "string") {
      elm = (d || document).createElement(elm);
    }
    elm = $BK(elm);
    return elm;
  },

  appendTo: function(elm) {
    elm.appendChild(this);
    return this;
  },

  appendBefore: function(elm) {
    elm.parentNode.insertBefore(this, elm);
    return this;
  },

  addEvent: function(type, fn) {
    bkLib.addEvent(this, type, fn);
    return this;
  },

  setContent: function(c) {
    this.innerHTML = c;
    return this;
  },

  pos: function() {
    var curleft = curtop = 0;
    var o = obj = this;
    if (obj.offsetParent) {
      do {
        curleft += obj.offsetLeft;
        curtop += obj.offsetTop;
      } while (obj = obj.offsetParent);
    }
    var b = (!window.opera) ? parseInt(this.getStyle('border-width') || this.style.border, 10) || 0 : 0;
    return [curleft + b, curtop + b + this.offsetHeight];
  },

  noSelect: function() {
    bkLib.noSelect(this);
    return this;
  },

  parentTag: function(t) {
    var elm = this;
    do {
      if (elm && elm.nodeName && elm.nodeName.toUpperCase() == t) {
        return elm;
      }
      elm = elm.parentNode;
    } while (elm);
    return false;
  },

  hasClass: function(cls) {
    return this.className.match(new RegExp('(\\s|^)nicEdit-' + cls + '(\\s|$)'));
  },

  addClass: function(cls) {
    if (!this.hasClass(cls)) {
      this.className += " nicEdit-" + cls;
    }
    return this;
  },
  addMyClass: function(cls) {
    if (!this.hasClass(cls)) {
      this.className += cls;
    }
    return this;
  },

  removeClass: function(cls) {
    if (this.hasClass(cls)) {
      this.className = this.className.replace(new RegExp('(\\s|^)nicEdit-' + cls + '(\\s|$)'), ' ');
    }
    return this;
  },

  setStyle: function(st) {
    var elmStyle = this.style;
    for (var itm in st) {
      switch (itm) {
      case 'float':
        elmStyle['cssFloat'] = elmStyle['styleFloat'] = st[itm];
        break;
      case 'opacity':
        elmStyle.opacity = st[itm];
        elmStyle.filter = "alpha(opacity=" + Math.round(st[itm] * 100) + ")";
        break;
      case 'className':
        this.className = st[itm];
        break;
      default:
        //if(document.compatMode || itm != "cursor") { // Nasty Workaround for IE 5.5
        elmStyle[itm] = st[itm];
        //}
      }
    }
    return this;
  },

  getStyle: function(cssRule, d) {
    var doc = (!d) ? document.defaultView : d;
    if (this.nodeType == 1) {
      if (doc && doc.getComputedStyle) {
        return doc.getComputedStyle(this, null).getPropertyValue(cssRule);
      } else {
        return this.currentStyle[bkLib.camelize(cssRule)];
      }
    }
  },

  remove: function() {
    this.parentNode.removeChild(this);
    return this;
  },

  setAttributes: function(at) {
    for (var itm in at) {
      this[itm] = at[itm];
    }
    return this;
  }
});

var bkLib = {
  isMSIE: (navigator.appVersion.indexOf("MSIE") != -1),

  addEvent: function(obj, type, fn) {
    if (obj.addEventListener) {
      obj.addEventListener(type, fn, false);
    } else {
      obj.attachEvent("on" + type, fn);
    }
  },

  toArray: function(iterable) {
    var length = iterable.length,
      results = new Array(length);
    while (length--) {
      results[length] = iterable[length];
    }
    return results;
  },

  noSelect: function(element) {
    if (element.setAttribute && element.nodeName.toLowerCase() != 'input' && element.nodeName.toLowerCase() != 'textarea') {
      element.setAttribute('unselectable', 'on');
    }
    for (var i = 0; i < element.childNodes.length; i++) {
      bkLib.noSelect(element.childNodes[i]);
    }
  },
  camelize: function(s) {
    return s.replace(/\-(.)/g, function(m, l) {
      return l.toUpperCase();
    });
  },
  inArray: function(arr, item) {
    return (bkLib.search(arr, item) !== null);
  },
  search: function(arr, itm) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == itm)
        return i;
    }
    return null;
  },
  cancelEvent: function(e) {
    e = e || window.event;
    if (e.preventDefault && e.stopPropagation) {
      e.preventDefault();
      e.stopPropagation();
    }
    return false;
  },
  domLoad: [],
  domLoaded: function() {
    if (arguments.callee.done) return;
    arguments.callee.done = true;
    for (i = 0; i < bkLib.domLoad.length; i++) bkLib.domLoad[i]();
  },
  onDomLoaded: function(fireThis) {
    this.domLoad.push(fireThis);
    if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", bkLib.domLoaded, null);
    } else if (bkLib.isMSIE) {
      document.write("<style>.nicEdit-main p { margin: 0; }</style><scr" + "ipt id=__ie_onload defer " + ((location.protocol == "https:") ? "src='javascript:void(0)'" : "src=//0") + "><\/scr" + "ipt>");
      $BK("__ie_onload").onreadystatechange = function() {
        if (this.readyState == "complete") {
          bkLib.domLoaded();
        }
      };
    }
    window.onload = bkLib.domLoaded;
  }
};

function $BK(elm) {
  if (typeof(elm) == "string") {
    elm = document.getElementById(elm);
  }
  return (elm && !elm.appendTo) ? bkExtend(elm, bkElement.prototype) : elm;
}

var bkEvent = {
  addEvent: function(evType, evFunc) {
    if (evFunc) {
      this.eventList = this.eventList || {};
      this.eventList[evType] = this.eventList[evType] || [];
      this.eventList[evType].push(evFunc);
    }
    return this;
  },
  fireEvent: function() {
    var args = bkLib.toArray(arguments),
      evType = args.shift();
    if (this.eventList && this.eventList[evType]) {
      for (var i = 0; i < this.eventList[evType].length; i++) {
        this.eventList[evType][i].apply(this, args);
      }
    }
  }
};

function __(s) {
  return s;
}

Function.prototype.closure = function() {
  var __method = this,
    args = bkLib.toArray(arguments),
    obj = args.shift();
  return function() {
    if (typeof(bkLib) != 'undefined') {
      return __method.apply(obj, args.concat(bkLib.toArray(arguments)));
    }
  };
};

Function.prototype.closureListener = function() {
  var __method = this,
    args = bkLib.toArray(arguments),
    object = args.shift();
  return function(e) {
    var target;
    e = e || window.event;
    if (e.target) {
      target = e.target;
    } else {
      target = e.srcElement;
    }
    return __method.apply(object, [e, target].concat(args));
  };
};


/* START CONFIG */

var nicEditorConfig = bkClass.extend({
  buttons: {
    'bold': {
      name: __('Click to Bold'),
      command: 'Bold',
      tags: ['B', 'STRONG'],
      css: {
        'font-weight': 'bold'
      },
      key: 'b'
    },
    'italic': {
      name: __('Click to Italic'),
      command: 'Italic',
      tags: ['EM', 'I'],
      css: {
        'font-style': 'italic'
      },
      key: 'i'
    },
    'underline': {
      name: __('Click to Underline'),
      command: 'Underline',
      tags: ['U'],
      css: {
        'text-decoration': 'underline'
      },
      key: 'u'
    },
    'left': {
      name: __('Left Align'),
      command: 'justifyleft',
      noActive: true
    },
    'center': {
      name: __('Center Align'),
      command: 'justifycenter',
      noActive: true
    },
    'right': {
      name: __('Right Align'),
      command: 'justifyright',
      noActive: true
    },
    'justify': {
      name: __('Justify Align'),
      command: 'justifyfull',
      noActive: true
    },
    'ol': {
      name: __('Insert Ordered List'),
      command: 'insertorderedlist',
      tags: ['OL']
    },
    'ul': {
      name: __('Insert Unordered List'),
      command: 'insertunorderedlist',
      tags: ['UL']
    },
    'subscript': {
      name: __('Click to Subscript'),
      command: 'subscript',
      tags: ['SUB']
    },
    'superscript': {
      name: __('Click to Superscript'),
      command: 'superscript',
      tags: ['SUP']
    },
    'strikethrough': {
      name: __('Click to Strike Through'),
      command: 'strikeThrough',
      css: {
        'text-decoration': 'line-through'
      }
    },
    'removeformat': {
      name: __('Remove Formatting'),
      command: 'removeformat',
      noActive: true
    },
    'indent': {
      name: __('Indent Text'),
      command: 'indent',
      noActive: true
    },
    'outdent': {
      name: __('Remove Indent'),
      command: 'outdent',
      noActive: true
    },
    'hr': {
      name: __('Horizontal Rule'),
      command: 'insertHorizontalRule',
      noActive: true
    }
  },
  iconsPath: 'img/nicEditorIcons.gif',
  buttonList: ['save', 'bold', 'italic', 'underline', 'left', 'center', 'right', 'justify', 'ol', 'ul', 'fontSize', 'fontFamily', 'fontFormat', 'indent', 'outdent', 'image', 'upload', 'link', 'unlink', 'forecolor', 'bgcolor'],
  iconList: {
    "xhtml": 1,
    "bgcolor": 2,
    "forecolor": 3,
    "bold": 4,
    "center": 5,
    "hr": 6,
    "indent": 7,
    "italic": 8,
    "justify": 9,
    "left": 10,
    "ol": 11,
    "outdent": 12,
    "removeformat": 13,
    "right": 14,
    "save": 25,
    "strikethrough": 16,
    "subscript": 17,
    "superscript": 18,
    "ul": 19,
    "underline": 20,
    "image": 21,
    "link": 22,
    "unlink": 23,
    "close": 24,
    "arrow": 26,
    "upload": 27
  },
  initWithLineBreak: true
});
/* END CONFIG */


var nicEditors = {
  nicPlugins: [],
  editors: [],

  registerPlugin: function(plugin, options) {
    this.nicPlugins.push({
      p: plugin,
      o: options
    });
  },

  allTextAreas: function(nicOptions) {
    var textareas = document.getElementsByTagName("textarea");
    for (var i = 0; i < textareas.length; i++) {
      nicEditors.editors.push(new nicEditor(nicOptions).panelInstance(textareas[i]));
    }
    return nicEditors.editors;
  },

  findEditor: function(e) {
    var editors = nicEditors.editors;
    for (var i = 0; i < editors.length; i++) {
      if (editors[i].instanceById(e)) {
        return editors[i]; // r is an instance of nicEditorInstance therefore it does not have removeInstance or removePanel methods
      }
    }
  }
};


var nicEditor = bkClass.extend({
  construct: function(o) {
    this.options = new nicEditorConfig();
    bkExtend(this.options, o);
    this.nicInstances = [];
    this.loadedPlugins = [];

    var plugins = nicEditors.nicPlugins;
    for (var i = 0; i < plugins.length; i++) {
      this.loadedPlugins.push(new plugins[i].p(this, plugins[i].o));
    }
    nicEditors.editors.push(this);
    bkLib.addEvent(document.body, 'mousedown', this.selectCheck.closureListener(this));
  },

  panelInstance: function(e, o) {
    e = this.checkReplace($BK(e));
    var panelElm = new bkElement('DIV').setStyle({
      width: (parseInt(e.getStyle('width'), 10) || e.clientWidth) + 'px'
    }).appendBefore(e);
    this.setPanel(panelElm);
    return this.addInstance(e, o);
  },

  checkReplace: function(e) {
    var r = nicEditors.findEditor(e);
    if (r) {
      r.removeInstance(e);
      r.removePanel();
    }
    return e;
  },

  addInstance: function(e, o) {
    var newInstance;
    e = this.checkReplace($BK(e));
    if (e.contentEditable || !!window.opera) {
      newInstance = new nicEditorInstance(e, o, this);
    } else {
      newInstance = new nicEditorIFrameInstance(e, o, this);
    }
    this.nicInstances.push(newInstance);
    return this;
  },

  removeInstance: function(e) {
    e = $BK(e);
    var instances = this.nicInstances;
    for (var i = 0; i < instances.length; i++) {
      if (instances[i].e == e) {
        instances[i].remove();
        this.nicInstances.splice(i, 1);
      }
    }
  },

  removePanel: function(e) {
    if (this.nicPanel) {
      this.nicPanel.remove();
      this.nicPanel = null;
    }
  },

  instanceById: function(e) {
    e = $BK(e);
    var instances = this.nicInstances;
    for (var i = 0; i < instances.length; i++) {
      if (instances[i].e == e) {
        return instances[i];
      }
    }
  },

  setPanel: function(e) {
    this.nicPanel = new nicEditorPanel($BK(e), this.options, this);
    this.fireEvent('panel', this.nicPanel);
    return this;
  },

  nicCommand: function(cmd, args) {
    if (this.selectedInstance) {
      this.selectedInstance.nicCommand(cmd, args);
    }
  },

  getIcon: function(iconName, options) {
    var icon = this.options.iconList[iconName];
    var file = (options.iconFiles) ? options.iconFiles[iconName] : '';
    return {
      backgroundImage: "url('" + ((icon) ? this.options.iconsPath : file) + "')",
      backgroundPosition: ((icon) ? ((icon - 1) * -18) : 0) + 'px 0px'
    };
  },

  selectCheck: function(e, t) {
    var found = false;
    do {
      if (t.className && t.className.indexOf('nicEdit') != -1) {
        return false;
      }
    } while (t = t.parentNode);
    this.fireEvent('blur', this.selectedInstance, t);
    this.lastSelectedInstance = this.selectedInstance;
    this.selectedInstance = null;
    return false;
  }

});
nicEditor = nicEditor.extend(bkEvent);


var nicEditorInstance = bkClass.extend({
  isSelected: false,

  construct: function(e, options, nicEditor) {
    this.ne = nicEditor;
    this.elm = this.e = e;
    this.options = options || {};

    newX = parseInt(e.getStyle('width'), 10) || e.clientWidth;
    newY = parseInt(e.getStyle('height'), 10) || e.clientHeight;
    this.initialHeight = newY - 8;

    var isTextarea = (e.nodeName.toLowerCase() == "textarea");
    if (isTextarea || this.options.hasPanel) {
      var ie7s = (bkLib.isMSIE && !((typeof document.body.style.maxHeight != "undefined") && document.compatMode == "CSS1Compat"));
      var s = {
        width: newX + 'px',
        border: 'none', //border: '1px solid #ccc',
        borderTop: 0,
        overflowY: 'auto',
        overflowX: 'hidden'
      };
      s[(ie7s) ? 'height' : 'maxHeight'] = (this.ne.options.maxHeight) ? this.ne.options.maxHeight + 'px' : null;
      this.editorContain = new bkElement('DIV').setStyle(s).appendBefore(e);
      var editorElm = new bkElement('DIV').setStyle({
        width: (newX - 8) + 'px',
        margin: '4px',
        minHeight: newY + 'px',
        outline: '0px'
      }).addClass('main').appendTo(this.editorContain);

      e.setStyle({
        display: 'none'
      });

      editorElm.innerHTML = e.innerHTML;
      if (isTextarea) {
        this.copyElm = e;
        var f = e.parentTag('FORM');
        if (f) {
          bkLib.addEvent(f, 'submit', this.saveContent.closure(this));
        }
      }
      editorElm.setStyle((ie7s) ? {
        height: newY + 'px'
      } : {
        overflow: 'hidden'
      });
      this.elm = editorElm;
    }
    this.ne.addEvent('blur', this.blur.closure(this));

    this.init();
    this.blur();
  },

  init: function() {
    this.elm.setAttribute('contentEditable', 'true');
    if (this.getContent() === "" && this.options.initWithLineBreak) {
      this.setContent('<br />');
    }
    this.instanceDoc = document.defaultView;
    this.elm.addEvent('mousedown', this.selected.closureListener(this)).addEvent('keypress', this.keyDown.closureListener(this)).addEvent('focus', this.selected.closure(this)).addEvent('blur', this.blur.closure(this)).addEvent('keyup', this.selected.closure(this));
    this.ne.fireEvent('add', this);
  },

  remove: function() {
    this.saveContent();
    if (this.copyElm || this.options.hasPanel) {
      this.editorContain.remove();
      this.e.setStyle({
        'display': 'block'
      });
      this.ne.removePanel();
    }
    this.disable();
    this.ne.fireEvent('remove', this);
  },

  disable: function() {
    this.elm.setAttribute('contentEditable', 'false');
  },

  getSel: function() {
    return (window.getSelection) ? window.getSelection() : document.selection;
  },

  getRng: function() {
    var s = this.getSel();
    if (!s) {
      return null;
    }
    return (s.rangeCount > 0) ? s.getRangeAt(0) :
      s.createRange && s.createRange() || document.createRange();
  },

  selRng: function(rng, s) {
    if (window.getSelection) {
      s.removeAllRanges();
      s.addRange(rng);
    } else {
      rng.select();
    }
  },

  selElm: function() {
    var r = this.getRng();
    if (r.startContainer) {
      var contain = r.startContainer;
      if (r.cloneContents().childNodes.length == 1) {
        for (var i = 0; i < contain.childNodes.length; i++) {
          var rng = contain.childNodes[i].ownerDocument.createRange();
          rng.selectNode(contain.childNodes[i]);
          if (r.compareBoundaryPoints(Range.START_TO_START, rng) != 1 &&
            r.compareBoundaryPoints(Range.END_TO_END, rng) != -1) {
            return $BK(contain.childNodes[i]);
          }
        }
      }
      return $BK(contain);
    } else {
      return $BK((this.getSel().type == "Control") ? r.item(0) : r.parentElement());
    }
  },

  saveRng: function() {
    this.savedRange = this.getRng();
    this.savedSel = this.getSel();
  },

  restoreRng: function() {
    if (this.savedRange) {
      this.selRng(this.savedRange, this.savedSel);
    }
  },

  keyDown: function(e, t) {
    this.ne.fireEvent('keyDown', this, e);

    if (e.ctrlKey) {
      this.ne.fireEvent('key', this, e);
    }
  },

  selected: function(e, t) {
    if (!t) {
      t = this.selElm();
    }
    if (!e.ctrlKey) {
      var selInstance = this.ne.selectedInstance;
      if (selInstance != this) {
        if (selInstance) {
          this.ne.fireEvent('blur', selInstance, t);
        }
        this.ne.selectedInstance = this;
        this.ne.fireEvent('focus', selInstance, t);
      }
      this.ne.fireEvent('selected', selInstance, t);
      this.isFocused = true;
      this.elm.addClass('selected');
    }
    return false;
  },

  blur: function() {
    this.isFocused = false;
    this.elm.removeClass('selected');
  },

  saveContent: function() {
    if (this.copyElm || this.options.hasPanel) {
      this.ne.fireEvent('save', this);
      if (this.copyElm) {
        this.copyElm.value = this.getContent();
      } else {
        this.e.innerHTML = this.getContent();
      }
    }
  },

  getElm: function() {
    return this.elm;
  },

  getContent: function() {
    this.content = this.getElm().innerHTML;
    this.ne.fireEvent('get', this);
    return this.content;
  },

  setContent: function(e) {
    this.content = e;
    this.ne.fireEvent('set', this);
    this.elm.innerHTML = this.content;
  },

  nicCommand: function(cmd, args) {
    document.execCommand(cmd, false, args);
  }
});

var nicEditorIFrameInstance = nicEditorInstance.extend({
  savedStyles: [],

  init: function() {
    var c = this.elm.innerHTML.replace(/^\s+|\s+$/g, '');
    this.elm.innerHTML = '';
    if (!c) {
      c = "<br />";
    }
    this.initialContent = c;

    this.elmFrame = new bkElement('iframe').setAttributes({
      'src': 'javascript:;',
      'frameBorder': 0,
      'allowTransparency': 'true',
      'scrolling': 'no'
    }).setStyle({
      height: '100px',
      width: '100%'
    }).addClass('frame').appendTo(this.elm);

    if (this.copyElm) {
      this.elmFrame.setStyle({
        width: (this.elm.offsetWidth - 4) + 'px'
      });
    }

    var styleList = ['font-size', 'font-family', 'font-weight', 'color'];
    for (var itm in styleList) {
      this.savedStyles[bkLib.camelize(itm)] = this.elm.getStyle(itm);
    }

    setTimeout(this.initFrame.closure(this), 50);
  },

  disable: function() {
    this.elm.innerHTML = this.getContent();
  },

  initFrame: function() {
    var fd = $BK(this.elmFrame.contentWindow.document);
    fd.designMode = "on";
    fd.open();
    var css = this.ne.options.externalCSS;
    fd.write('<html><head>' + ((css) ? '<link href="' + css + '" rel="stylesheet" type="text/css" />' : '') + '</head><body id="nicEditContent" style="margin: 0 !important; background-color: transparent !important;">' + this.initialContent + '</body></html>');
    fd.close();
    this.frameDoc = fd;

    this.frameWin = $BK(this.elmFrame.contentWindow);
    this.frameContent = $BK(this.frameWin.document.body).setStyle(this.savedStyles);
    this.instanceDoc = this.frameWin.document.defaultView;

    this.heightUpdate();
    this.frameDoc.addEvent('mousedown', this.selected.closureListener(this)).addEvent('keyup', this.heightUpdate.closureListener(this)).addEvent('keydown', this.keyDown.closureListener(this)).addEvent('keyup', this.selected.closure(this));
    this.ne.fireEvent('add', this);
  },

  getElm: function() {
    return this.frameContent;
  },

  setContent: function(c) {
    this.content = c;
    this.ne.fireEvent('set', this);
    this.frameContent.innerHTML = this.content;
    this.heightUpdate();
  },

  getSel: function() {
    return (this.frameWin) ? this.frameWin.getSelection() : this.frameDoc.selection;
  },

  heightUpdate: function() {
    this.elmFrame.style.height = Math.max(this.frameContent.offsetHeight, this.initialHeight) + 'px';
  },

  nicCommand: function(cmd, args) {
    this.frameDoc.execCommand(cmd, false, args);
    setTimeout(this.heightUpdate.closure(this), 100);
  }


});
var nicEditorPanel = bkClass.extend({
  construct: function(e, options, nicEditor) {
    this.elm = e;
    this.options = options;
    this.ne = nicEditor;
    this.panelButtons = [];
    this.buttonList = bkExtend([], this.ne.options.buttonList);

    this.panelContain = new bkElement('DIV').setStyle({//new bkElement('SPAN').setStyle({
      overflow: 'hidden',
      width: '100%',
      border: '1px hidden'//solid #cccccc'//,
      //backgroundColor: '#efefef'
    }).addClass('panelContain');
    this.panelElm = new bkElement('DIV').setStyle({//new bkElement('SPAN').setStyle({
      margin: '2px',
      marginTop: '0px',
      zoom: 1,
      overflow: 'hidden'
    }).addClass('panel').appendTo(this.panelContain);
    this.panelContain.appendTo(e);

    var opt = this.ne.options;
    var buttons = opt.buttons;
    for (var button in buttons) {
      this.addButton(button, opt, true);
    }
    this.reorder();
    e.noSelect();
  },

  addButton: function(buttonName, options, noOrder) {
    var button = options.buttons[buttonName];
    var type = null;

    if (button['type']) {
      type = typeof(window[button['type']]) === undefined ? null : window[button['type']];
    } else {
      type = nicEditorButton;
    }
    var hasButton = bkLib.inArray(this.buttonList, buttonName);
    if (type && (hasButton || this.ne.options.fullPanel)) {
      this.panelButtons.push(new type(this.panelElm, buttonName, options, this.ne));
      if (!hasButton) {
        this.buttonList.push(buttonName);
      }
    }
  },

  findButton: function(itm) {
    for (var i = 0; i < this.panelButtons.length; i++) {
      if (this.panelButtons[i].name == itm)
        return this.panelButtons[i];
    }
  },

  reorder: function() {
    var bl = this.buttonList;
    for (var i = 0; i < bl.length; i++) {
      var button = this.findButton(bl[i]);
      if (button) {
        this.panelElm.appendChild(button.margin);
      }
    }
  },

  remove: function() {
    this.elm.remove();
  }
});
var nicEditorButton = bkClass.extend({

  construct: function(e, buttonName, options, nicEditor) {
    this.options = options.buttons[buttonName];
    this.name = buttonName;
    this.ne = nicEditor;
    this.elm = e;

    this.margin = new bkElement('DIV').setStyle({
      'float': 'left',
      marginTop: '2px'
    }).appendTo(e);
    this.contain = new bkElement('DIV').setStyle({
      width: '20px',
      height: '20px'
    }).addClass('buttonContain').appendTo(this.margin);
    this.border = new bkElement('DIV').setStyle({
      //backgroundColor: '#efefef',
      border: '1px solid #efefef'
    }).appendTo(this.contain);
    this.button = new bkElement('DIV').setStyle({
      width: '18px',
      height: '18px',
      overflow: 'hidden',
      zoom: 1,
      cursor: 'pointer'
    }).addClass('button').setStyle(this.ne.getIcon(buttonName, options)).appendTo(this.border);
    this.button.addEvent('mouseover', this.hoverOn.closure(this)).addEvent('mouseout', this.hoverOff.closure(this)).addEvent('mousedown', this.mouseClick.closure(this)).noSelect();

    if (!window.opera) {
      this.button.onmousedown = this.button.onclick = bkLib.cancelEvent;
    }

    nicEditor.addEvent('selected', this.enable.closure(this)).addEvent('blur', this.disable.closure(this)).addEvent('key', this.key.closure(this));

    this.disable();
    this.init();
  },

  init: function() {},

  hide: function() {
    this.contain.setStyle({
      display: 'none'
    });
  },

  updateState: function() {
    if (this.isDisabled) {
      this.setBg();
    } else if (this.isHover) {
      this.setBg('hover');
    } else if (this.isActive) {
      this.setBg('active');
    } else {
      this.setBg();
    }
  },

  setBg: function(state) {
    var stateStyle;
    switch (state) {
    case 'hover':
      stateStyle = {
        border: '1px solid #666'//,      // Change button border here
        //backgroundColor: '#ddd'        // Change Button background color here
      };
      break;
    case 'active':
      stateStyle = {
        border: '1px solid #666'//,     // Change button active state border here.
        //backgroundColor: '#ccc'       // Change button active state background color here.
      };
      break;
    default:
      stateStyle = {
        border: '1px hidden' //border: '1px solid #efefef',
        //backgroundColor: '#efefef'
      };
    }
    this.border.setStyle(stateStyle).addClass('button-' + state);
  },

  checkNodes: function(e) {
    var elm = e;
    do {
      if (this.options.tags && bkLib.inArray(this.options.tags, elm.nodeName)) {
        this.activate();
        return true;
      }
    } while ((elm = elm.parentNode) && elm.className != "nicEdit");
    elm = $BK(e);
    while (elm.nodeType == 3) {
      elm = $BK(elm.parentNode);
    }
    if (this.options.css) {
      for (var itm in this.options.css) {
        if (elm.getStyle(itm, this.ne.selectedInstance.instanceDoc) == this.options.css[itm]) {
          this.activate();
          return true;
        }
      }
    }
    this.deactivate();
    return false;
  },

  activate: function() {
    if (!this.isDisabled) {
      this.isActive = true;
      this.updateState();
      this.ne.fireEvent('buttonActivate', this);
    }
  },

  deactivate: function() {
    this.isActive = false;
    this.updateState();
    if (!this.isDisabled) {
      this.ne.fireEvent('buttonDeactivate', this);
    }
  },

  enable: function(ins, t) {
    this.isDisabled = false;
    this.contain.setStyle({
      'opacity': 1
    }).addClass('buttonEnabled');
    this.updateState();
    if (t !== document) {
      this.checkNodes(t);
    }
  },

  disable: function(ins, t) {
    this.isDisabled = true;
    this.contain.setStyle({
      'opacity': 0.6
    }).removeClass('buttonEnabled');
    this.updateState();
  },

  toggleActive: function() {
    if (this.isActive) {
      this.deactivate();
    } else {
      this.activate();
    }
  },

  hoverOn: function() {
    if (!this.isDisabled) {
      this.isHover = true;
      this.updateState();
      this.ne.fireEvent("buttonOver", this);
    }
  },

  hoverOff: function() {
    this.isHover = false;
    this.updateState();
    this.ne.fireEvent("buttonOut", this);
  },

  mouseClick: function() {
    if (this.options.command) {
      this.ne.nicCommand(this.options.command, this.options.commandArgs);
      if (!this.options.noActive) {
        this.toggleActive();
      }
    }
    this.ne.fireEvent("buttonClick", this);
  },

  key: function(nicInstance, e) {
    if (this.options.key && e.ctrlKey && String.fromCharCode(e.keyCode || e.charCode).toLowerCase() == this.options.key) {
      this.mouseClick();
      if (e.preventDefault) e.preventDefault();
    }
  }

});


var nicPlugin = bkClass.extend({

  construct: function(nicEditor, options) {
    this.options = options;
    this.ne = nicEditor;
    this.ne.addEvent('panel', this.loadPanel.closure(this));

    this.init();
  },

  loadPanel: function(np) {
    var buttons = this.options.buttons;
    for (var button in buttons) {
      np.addButton(button, this.options);
    }
    np.reorder();
  },

  init: function() {}
});




/* START CONFIG */
var nicPaneOptions = {};
/* END CONFIG */

var nicEditorPane = bkClass.extend({
  construct: function(elm, nicEditor, options, openButton) {
    this.ne = nicEditor;
    this.elm = elm;
    this.pos = elm.pos();

    this.contain = new bkElement('div').setStyle({
      zIndex: '2',
      overflow: 'hidden',
      position: 'fixed',
      left: this.pos[0] + 'px',
      top: this.pos[1] + 'px'
    });
    this.pane = new bkElement('div').setStyle({
      fontSize: '12px',
      border: '1px solid #ccc',
      overflow: 'hidden',
      padding: '4px',
      textAlign: 'left',
      backgroundColor: '#ffffc9'
    }).addClass('pane').setStyle(options).appendTo(this.contain);

    if (openButton && !openButton.options.noClose) {
      this.close = new bkElement('div').setStyle({
        'float': 'right',
        height: '16px',
        width: '16px',
        cursor: 'pointer'
      }).setStyle(this.ne.getIcon('close', nicPaneOptions)).addEvent('mousedown', openButton.removePane.closure(this)).appendTo(this.pane);
    }

    this.contain.noSelect().appendTo(document.body);

    this.position();
    this.init();
  },

  init: function() {},

  position: function() {
    if (this.ne.nicPanel) {
      var panelElm = this.ne.nicPanel.elm;
      var panelPos = panelElm.pos();
      var newLeft = panelPos[0] + parseInt(panelElm.getStyle('width'), 10) - (parseInt(this.pane.getStyle('width'), 10) + 8);
      if (newLeft < this.pos[0]) {
        this.contain.setStyle({
          left: newLeft + 'px'
        });
      }
    }
  },

  toggle: function() {
    this.isVisible = !this.isVisible;
    this.contain.setStyle({
      display: ((this.isVisible) ? 'block' : 'none')
    });
  },

  remove: function() {
    if (this.contain) {
      this.contain.remove();
      this.contain = null;
    }
  },

  append: function(c) {
    c.appendTo(this.pane);
  },

  setContent: function(c) {
    this.pane.setContent(c);
  }

});



var nicEditorAdvancedButton = nicEditorButton.extend({

  init: function() {
    this.ne.addEvent('selected', this.removePane.closure(this)).addEvent('blur', this.removePane.closure(this));
  },

  mouseClick: function() {
    if (!this.isDisabled) {
      if (this.pane && this.pane.pane) {
        this.removePane();
      } else {
        this.pane = new nicEditorPane(this.contain, this.ne, {
          width: (this.width || '270px'),
          backgroundColor: '#fff'
        }, this);
        this.addPane();
        this.ne.selectedInstance.saveRng();
      }
    }
  },

  addForm: function(f, elm) {
    this.form = new bkElement('form').addEvent('submit', this.submit.closureListener(this));
    this.pane.append(this.form);
    this.inputs = {};

    for (var itm in f) {
      var field = f[itm];
      var val = '';
      if (elm) {
        val = elm.getAttribute(itm);
      }
      if (!val) {
        val = field['value'] || '';
      }
      var type = f[itm].type;

      if (type == 'title') {
        new bkElement('div').setContent(field.txt).setStyle({
          fontSize: '14px',
          fontWeight: 'bold',
          padding: '0px',
          margin: '2px 0'
        }).appendTo(this.form);
      } else {
        var contain = new bkElement('div').setStyle({
          overflow: 'hidden',
          clear: 'both'
        }).appendTo(this.form);
        if (field.txt) {
          new bkElement('label').setAttributes({
            'for': itm
          }).setContent(field.txt).setStyle({
            margin: '2px 4px',
            fontSize: '13px',
            width: '50px',
            lineHeight: '20px',
            textAlign: 'right',
            'float': 'left'
          }).appendTo(contain);
        }

        switch (type) {
        case 'text':
          this.inputs[itm] = new bkElement('input').setAttributes({
            id: itm,
            'value': val,
            'type': 'text'
          }).setStyle({
            margin: '2px 0',
            fontSize: '13px',
            'float': 'left',
            height: '20px',
            border: '1px solid #ccc',
            overflow: 'hidden'
          }).setStyle(field.style).appendTo(contain);
          break;
        case 'select':
          this.inputs[itm] = new bkElement('select').setAttributes({
            id: itm
          }).setStyle({
            border: '1px solid #ccc',
            'float': 'left',
            margin: '2px 0'
          }).appendTo(contain);
          for (var opt in field.options) {
            var o = new bkElement('option').setAttributes({
              value: opt,
              selected: (opt == val) ? 'selected' : ''
            }).setContent(field.options[opt]).appendTo(this.inputs[itm]);
          }
          break;
        case 'content':
          this.inputs[itm] = new bkElement('textarea').setAttributes({
            id: itm
          }).setStyle({
            border: '1px solid #ccc',
            'float': 'left'
          }).setStyle(field.style).appendTo(contain);
          this.inputs[itm].value = val;
        }
      }
    }
    new bkElement('input').setAttributes({
      'type': 'submit'
    }).setStyle({
      backgroundColor: '#efefef',
      border: '1px solid #ccc',
      margin: '3px 0',
      'float': 'left',
      'clear': 'both'
    }).appendTo(this.form);
    this.form.onsubmit = bkLib.cancelEvent;
  },

  submit: function() {},

  findElm: function(tag, attr, val) {
    var list = this.ne.selectedInstance.getElm().getElementsByTagName(tag);
    for (var i = 0; i < list.length; i++) {
      if (list[i].getAttribute(attr) == val) {
        return $BK(list[i]);
      }
    }
  },

  removePane: function() {
    if (this.pane) {
      this.pane.remove();
      this.pane = null;
      this.ne.selectedInstance.restoreRng();
    }
  }
});


var nicButtonTips = bkClass.extend({
  construct: function(nicEditor) {
    this.ne = nicEditor;
    nicEditor.addEvent('buttonOver', this.show.closure(this)).addEvent('buttonOut', this.hide.closure(this));

  },

  show: function(button) {
    this.timer = setTimeout(this.create.closure(this, button), 400);
  },

  create: function(button) {
    this.timer = null;
    if (!this.pane) {
      this.pane = new nicEditorPane(button.button, this.ne, {
        fontSize: '12px',
        marginTop: '5px'
      });
      this.pane.setContent(button.options.name);
    }
  },

  hide: function(button) {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (this.pane) {
      this.pane = this.pane.remove();
    }
  }
});
nicEditors.registerPlugin(nicButtonTips);



/* START CONFIG */
var nicSelectOptions = {
  buttons: {
    'fontSize': {
      name: __('Select Font Size'),
      type: 'nicEditorFontSizeSelect',
      command: 'fontsize'
    },
    'fontFamily': {
      name: __('Select Font Family'),
      type: 'nicEditorFontFamilySelect',
      command: 'fontname'
    },
    'fontFormat': {
      name: __('Select Font Format'),
      type: 'nicEditorFontFormatSelect',
      command: 'formatBlock'
    }
  }
};
/* END CONFIG */
var nicEditorSelect = bkClass.extend({

  construct: function(e, buttonName, options, nicEditor) {
    this.options = options.buttons[buttonName];
    this.elm = e;
    this.ne = nicEditor;
    this.name = buttonName;
    this.selOptions = [];

    this.margin = new bkElement('div').setStyle({
      'float': 'left',
      margin: '2px 1px 0 1px'
    }).appendTo(this.elm);
    this.contain = new bkElement('div').setStyle({
      width: '90px',
      height: '20px',
      cursor: 'pointer',
      overflow: 'hidden'
    }).addClass('selectContain').addEvent('click', this.toggle.closure(this)).appendTo(this.margin);
    this.items = new bkElement('div').setStyle({
      overflow: 'hidden',
      zoom: 1,
      border: '1px solid #ccc',
      paddingLeft: '3px',
      backgroundColor: '#fff'
    }).appendTo(this.contain);
    this.control = new bkElement('div').setStyle({
      overflow: 'hidden',
      'float': 'right',
      height: '18px',
      width: '16px'
    }).addClass('selectControl').setStyle(this.ne.getIcon('arrow', options)).appendTo(this.items);
    this.txt = new bkElement('div').setStyle({
      overflow: 'hidden',
      'float': 'left',
      width: '66px',
      height: '14px',
      marginTop: '1px',
      fontFamily: 'sans-serif',
      textAlign: 'center',
      fontSize: '10px'
    }).addClass('selectTxt').appendTo(this.items);

    if (!window.opera) {
      this.contain.onmousedown = this.control.onmousedown = this.txt.onmousedown = bkLib.cancelEvent;
    }

    this.margin.noSelect();

    this.ne.addEvent('selected', this.enable.closure(this)).addEvent('blur', this.disable.closure(this));

    this.disable();
    this.init();
  },

  disable: function() {
    this.isDisabled = true;
    this.close();
    this.contain.setStyle({
      opacity: 0.6
    });
  },

  enable: function(t) {
    this.isDisabled = false;
    this.close();
    this.contain.setStyle({
      opacity: 1
    });
  },

  setDisplay: function(txt) {
    this.txt.setContent(txt);
  },

  toggle: function() {
    if (!this.isDisabled) {
      if (this.pane) {
        this.close();
      } else {
        this.open();
      }
    }
  },

  open: function() {
    this.pane = new nicEditorPane(this.items, this.ne, {
      width: (this.width || '88px'),
      padding: '0px',
      borderTop: 0,
      borderLeft: '1px solid #ccc',
      borderRight: '1px solid #ccc',
      borderBottom: '0px',
      backgroundColor: '#fff'
    });

    for (var i = 0; i < this.selOptions.length; i++) {
      var opt = this.selOptions[i];
      var itmContain = new bkElement('div').setStyle({
        overflow: 'hidden',
        borderBottom: '1px solid #ccc',
        width: (this.width || '88px'),
        textAlign: 'left',
        cursor: 'pointer'
      });
      var itm = new bkElement('div').setStyle({
        padding: '0px 4px'
      }).setContent(opt[1]).appendTo(itmContain).noSelect();
      itm.addEvent('click', this.update.closure(this, opt[0])).addEvent('mouseover', this.over.closure(this, itm)).addEvent('mouseout', this.out.closure(this, itm)).setAttributes('id', opt[0]);
      this.pane.append(itmContain);
      if (!window.opera) {
        itm.onmousedown = bkLib.cancelEvent;
      }
    }
  },

  close: function() {
    if (this.pane) {
      this.pane = this.pane.remove();
    }
  },

  over: function(opt) {
    opt.setStyle({
      backgroundColor: '#ccc'
    });
  },

  out: function(opt) {
    opt.setStyle({
      backgroundColor: '#fff'
    });
  },


  add: function(k, v) {
    this.selOptions.push(new Array(k, v));
  },

  update: function(elm) {
    this.ne.nicCommand(this.options.command, elm);
    this.close();
  }
});

var nicEditorFontSizeSelect = nicEditorSelect.extend({
  width: '200px;',
  sel: {
    1: '1&nbsp;(8pt)',
    2: '2&nbsp;(10pt)',
    3: '3&nbsp;(12pt)',
    4: '4&nbsp;(14pt)',
    5: '5&nbsp;(18pt)',
    6: '6&nbsp;(24pt)'
  },
  init: function() {
    this.setDisplay('Font&nbsp;Size');
    for (var itm in this.sel) {
      this.add(itm, '<font size="' + itm + '">' + this.sel[itm] + '</font>');
    }
  }
});

var nicEditorFontFamilySelect = nicEditorSelect.extend({
  sel: {
    'arial': 'Arial',
    'comic sans ms': 'Comic Sans',
    'courier new': 'Courier New',
    'georgia': 'Georgia',
    'helvetica': 'Helvetica',
    'impact': 'Impact',
    'times new roman': 'Times',
    'trebuchet ms': 'Trebuchet',
    'verdana': 'Verdana'
  },

  init: function() {
    this.setDisplay('Font&nbsp;Family');
    for (var itm in this.sel) {
      this.add(itm, '<font face="' + itm + '">' + this.sel[itm] + '</font>');
    }
  }
});

var nicEditorFontFormatSelect = nicEditorSelect.extend({
  width: '100px;',
  sel: {
    'p': 'Paragraph',
    'pre': 'Pre',
    'h6': 'Heading&nbsp;6',
    'h5': 'Heading&nbsp;5',
    'h4': 'Heading&nbsp;4',
    'h3': 'Heading&nbsp;3',
    'h2': 'Heading&nbsp;2',
    'h1': 'Heading&nbsp;1'
  },

  init: function() {
    this.setDisplay('Font&nbsp;Format');
    for (var itm in this.sel) {
      var tag = itm.toUpperCase();
      this.add('<' + tag + '>', '<' + itm + ' style="padding: 0px; margin: 0px;">' + this.sel[itm] + '</' + tag + '>');
    }
  }
});

nicEditors.registerPlugin(nicPlugin, nicSelectOptions);



/* START CONFIG */
var nicLinkOptions = {
  buttons: {
    'link': {
      name: 'Add Link',
      type: 'nicLinkButton',
      tags: ['A']
    },
    'unlink': {
      name: 'Remove Link',
      command: 'unlink',
      noActive: true
    }
  }
};
/* END CONFIG */

var nicLinkButton = nicEditorAdvancedButton.extend({
  addPane: function() {
    this.ln = this.ne.selectedInstance.selElm().parentTag('A');
    this.addForm({
      '': {
        type: 'title',
        txt: 'Add/Edit Link'
      },
      'href': {
        type: 'text',
        txt: 'URL',
        value: 'http://',
        style: {
          width: '150px'
        }
      },
      'title': {
        type: 'text',
        txt: 'Title'
      },
      'target': {
        type: 'select',
        txt: 'Open In',
        options: {
          '': 'Current Window',
          '_blank': 'New Window'
        },
        style: {
          width: '100px'
        }
      }
    }, this.ln);
  },

  submit: function(e) {
    var url = this.inputs['href'].value;
    if (url === "http://" || url === "") {
      alert("You must enter a URL to Create a Link");
      return false;
    }
    this.removePane();

    if (!this.ln) {
      var tmp = 'javascript:nicTemp();';
      this.ne.nicCommand("createlink", tmp);
      this.ln = this.findElm('A', 'href', tmp);
      // set the link text to the title or the url if there is no text selected
      if (this.ln.innerHTML == tmp) {
        this.ln.innerHTML = this.inputs['title'].value || url;
      }
    }
    if (this.ln) {
      var oldTitle = this.ln.title;
      this.ln.setAttributes({
        href: this.inputs['href'].value,
        title: this.inputs['title'].value,
        target: this.inputs['target'].options[this.inputs['target'].selectedIndex].value
      });
      // set the link text to the title or the url if the old text was the old title
      if (this.ln.innerHTML == oldTitle) {
        this.ln.innerHTML = this.inputs['title'].value || this.inputs['href'].value;
      }
    }
  }
});

nicEditors.registerPlugin(nicPlugin, nicLinkOptions);



/* START CONFIG */
var nicColorOptions = {
  buttons: {
    'forecolor': {
      name: __('Change Text Color'),
      type: 'nicEditorColorButton',
      noClose: true
    },
    'bgcolor': {
      name: __('Change Background Color'),
      type: 'nicEditorBgColorButton',
      noClose: true
    }
  }
};
/* END CONFIG */

var nicEditorColorButton = nicEditorAdvancedButton.extend({
  width: '280px',
  addPane: function() {
    var colorList = {
      0: '00',
      1: '33',
      2: '66',
      3: '99',
      4: 'CC',
      5: 'FF'
    };
    var colorItems = new bkElement('DIV').setStyle({
      width: '270px'
    });

    for (var r in colorList) {
      for (var b in colorList) {
        for (var g in colorList) {
          var colorCode = '#' + colorList[r] + colorList[g] + colorList[b];

          var colorSquare = new bkElement('DIV').setStyle({
            'cursor': 'pointer',
            'height': '15px',
            'float': 'left'
          }).appendTo(colorItems);
          var colorBorder = new bkElement('DIV').setStyle({
            border: '2px solid ' + colorCode
          }).appendTo(colorSquare);
          var colorInner = new bkElement('DIV').setStyle({
            backgroundColor: colorCode,
            overflow: 'hidden',
            width: '11px',
            height: '11px'
          }).addEvent('click', this.colorSelect.closure(this, colorCode)).addEvent('mouseover', this.on.closure(this, colorBorder)).addEvent('mouseout', this.off.closure(this, colorBorder, colorCode)).appendTo(colorBorder);

          if (!window.opera) {
            colorSquare.onmousedown = colorInner.onmousedown = bkLib.cancelEvent;
          }

        }
      }
    }
    this.pane.append(colorItems.noSelect());
  },

  colorSelect: function(c) {
    this.ne.nicCommand('foreColor', c);
    this.removePane();
  },

  on: function(colorBorder) {
    colorBorder.setStyle({
      border: '2px solid #000'
    });
  },

  off: function(colorBorder, colorCode) {
    colorBorder.setStyle({
      border: '2px solid ' + colorCode
    });
  }
});

var nicEditorBgColorButton = nicEditorColorButton.extend({
  colorSelect: function(c) {
    this.ne.nicCommand('hiliteColor', c);
    this.removePane();
  }
});

nicEditors.registerPlugin(nicPlugin, nicColorOptions);



/* START CONFIG */
var nicImageOptions = {
  buttons: {
    'image': {
      name: 'Add Image',
      type: 'nicImageButton',
      tags: ['IMG']
    }
  }

};
/* END CONFIG */

var nicImageButton = nicEditorAdvancedButton.extend({
  addPane: function() {
    this.im = this.ne.selectedInstance.selElm().parentTag('IMG');
    this.addForm({
      '': {
        type: 'title',
        txt: 'Add/Edit Image'
      },
      'src': {
        type: 'text',
        txt: 'URL',
        'value': 'http://',
        style: {
          width: '150px'
        }
      },
      'alt': {
        type: 'text',
        txt: 'Alt Text',
        style: {
          width: '100px'
        }
      },
      'align': {
        type: 'select',
        txt: 'Align',
        options: {
          none: 'Default',
          'left': 'Left',
          'right': 'Right'
        }
      }
    }, this.im);
  },

  submit: function(e) {
    var src = this.inputs['src'].value;
    if (src === "" || src === "http://") {
      alert("You must enter a Image URL to insert");
      return false;
    }
    this.removePane();

    if (!this.im) {
      var tmp = 'javascript:nicImTemp();';
      this.ne.nicCommand("insertImage", tmp);
      this.im = this.findElm('IMG', 'src', tmp);
    }
    if (this.im) {
      this.im.setAttributes({
        src: this.inputs['src'].value,
        alt: this.inputs['alt'].value,
        align: this.inputs['align'].value
      });
    }
  }
});

nicEditors.registerPlugin(nicPlugin, nicImageOptions);




/* START CONFIG */
var nicSaveOptions = {
  buttons: {
    'save': {
      name: __('Save this content'),
      type: 'nicEditorSaveButton'
    }
  }
};
/* END CONFIG */

var nicEditorSaveButton = nicEditorButton.extend({
  init: function() {
    if (!this.ne.options.onSave) {
      this.margin.setStyle({
        'display': 'none'
      });
    }
  },
  mouseClick: function() {
    var onSave = this.ne.options.onSave;
    var selectedInstance = this.ne.selectedInstance;
    onSave(selectedInstance.getContent(), selectedInstance.elm.id, selectedInstance);
  }
});

nicEditors.registerPlugin(nicPlugin, nicSaveOptions);



/* START CONFIG */
var nicUploadOptions = {
  buttons: {
    'upload': {
      name: 'Upload Image',
      type: 'nicUploadButton'
    }
  }

};
/* END CONFIG */

var nicUploadButton = nicEditorAdvancedButton.extend({
  nicURI: 'http://files.nicedit.com/',

  addPane: function() {
    this.im = this.ne.selectedInstance.selElm().parentTag('IMG');
    this.myID = Math.round(Math.random() * Math.pow(10, 15));
    this.requestInterval = 1000;
    this.uri = this.ne.options.uploadURI || this.nicURI;
    nicUploadButton.lastPlugin = this;

    this.myFrame = new bkElement('iframe').setAttributes({
      width: '100%',
      height: '100px',
      frameBorder: 0,
      scrolling: 'no'
    }).setStyle({
      border: 0
    }).appendTo(this.pane.pane);
    this.progressWrapper = new bkElement('div').setStyle({
      display: 'none',
      width: '100%',
      height: '20px',
      border: '1px solid #ccc'
    }).appendTo(this.pane.pane);
    this.progress = new bkElement('div').setStyle({
      width: '0%',
      height: '20px',
      backgroundColor: '#ccc'
    }).setContent('&nbsp').appendTo(this.progressWrapper);

    setTimeout(this.addForm.closure(this), 50);
  },

  addForm: function() {
    var myDoc = this.myDoc = this.myFrame.contentWindow.document;
    myDoc.open();
    myDoc.write("<html><body>");
    myDoc.write('<form method="post" action="' + this.uri + '?id=' + this.myID + '" enctype="multipart/form-data">');
    myDoc.write('<input type="hidden" name="APC_UPLOAD_PROGRESS" value="' + this.myID + '" />');
    myDoc.write('<div style="font-size: 14px; font-weight: bold; padding-top: 5px;">Insert an Image</div>');
    myDoc.write('<input name="nicImage" type="file" style="margin-top: 10px;" />');
    myDoc.write('</form>');
    myDoc.write("</body></html>");
    myDoc.close();

    this.myBody = myDoc.body;

    this.myForm = $BK(this.myBody.getElementsByTagName('form')[0]);
    this.myInput = $BK(this.myBody.getElementsByTagName('input')[1]).addEvent('change', this.submit.closure(this));
    this.myStatus = new bkElement('div', this.myDoc).setStyle({
      textAlign: 'center',
      fontSize: '14px'
    }).appendTo(this.myBody);
  },
          
   submit: function() {
        var file    = $BK(this.myBody.getElementsByTagName('input')[1]).files[0];
        var reader  = new FileReader();
        var obj = this;
        reader.addEventListener("load", function () {
          setTimeout(obj.addImgTags.closure(obj,reader.result), obj.requestInterval);
          
        }, false);
        
        if (file)
        {
          reader.readAsDataURL(file);
        }
   },
   
   addImgTags: function(tmp) {
          this.removePane();

            if (!this.im) {
              this.ne.nicCommand("insertImage", tmp);
              this.im = this.findElm('IMG', 'src', tmp);
            }
            if (this.im) {
              this.im.setAttributes({
                src: tmp
              });
            }
   }
});

nicUploadButton.statusCb = function(o) {
  nicUploadButton.lastPlugin.update(o);
};

nicEditors.registerPlugin(nicPlugin, nicUploadOptions);



var nicXHTML = bkClass.extend({
  stripAttributes: ['_moz_dirty', '_moz_resizing', '_extended'],
  noShort: ['style', 'title', 'script', 'textarea', 'a'],
  cssReplace: {
    'font-weight:bold;': 'strong',
    'font-style:italic;': 'em'
  },
  sizes: {
    1: 'xx-small',
    2: 'x-small',
    3: 'small',
    4: 'medium',
    5: 'large',
    6: 'x-large'
  },

  construct: function(nicEditor) {
    this.ne = nicEditor;
    if (this.ne.options.xhtml) {
      nicEditor.addEvent('get', this.cleanup.closure(this));
    }
  },

  cleanup: function(ni) {
    var node = ni.getElm();
    var xhtml = this.toXHTML(node);
    ni.content = xhtml;
  },

  toXHTML: function(n, r, d) {
    var txt = '';
    var attrTxt = '';
    var cssTxt = '';
    var nType = n.nodeType;
    var nName = n.nodeName.toLowerCase();
    var nChild = n.hasChildNodes && n.hasChildNodes();
    var extraNodes = [];

    switch (nType) {
    case 1:
      var nAttributes = n.attributes;

      switch (nName) {
      case 'b':
        nName = 'strong';
        break;
      case 'i':
        nName = 'em';
        break;
      case 'font':
        nName = 'span';
        break;
      }

      if (r) {
        for (var i = 0; i < nAttributes.length; i++) {
          var attr = nAttributes[i];

          var attributeName = attr.nodeName.toLowerCase();
          var attributeValue = attr.nodeValue;

          if (!attr.specified || !attributeValue || bkLib.inArray(this.stripAttributes, attributeName) || typeof(attributeValue) == "function") {
            continue;
          }

          switch (attributeName) {
          case 'style':
            var css = attributeValue.replace(/ /g, "");
            for (var itm in this.cssReplace) {
              if (css.indexOf(itm) != -1) {
                extraNodes.push(this.cssReplace[itm]);
                css = css.replace(itm, '');
              }
            }
            cssTxt += css;
            attributeValue = "";
            break;
          case 'class':
            attributeValue = attributeValue.replace("Apple-style-span", "");
            break;
          case 'size':
            cssTxt += "font-size:" + this.sizes[attributeValue] + ';';
            attributeValue = "";
            break;
          }

          if (attributeValue) {
            attrTxt += ' ' + attributeName + '="' + attributeValue + '"';
          }
        }

        if (cssTxt) {
          attrTxt += ' style="' + cssTxt + '"';
        }

        for (var j = 0; j < extraNodes.length; j++) {
          txt += '<' + extraNodes[j] + '>';
        }

        if (attrTxt === "" && nName == "span") {
          r = false;
        }
        if (r) {
          txt += '<' + nName;
          if (nName != 'br') {
            txt += attrTxt;
          }
        }
      }

      if (!nChild && !bkLib.inArray(this.noShort, attributeName)) {
        if (r) {
          txt += ' />';
        }
      } else {
        if (r) {
          txt += '>';
        }

        for (var k = 0; k < n.childNodes.length; k++) {
          var results = this.toXHTML(n.childNodes[k], true, true);
          if (results) {
            txt += results;
          }
        }
      }

      if (r && nChild) {
        txt += '</' + nName + '>';
      }

      for (var l = 0; l < extraNodes.length; l++) {
        txt += '</' + extraNodes[l] + '>';
      }

      break;
    case 3:
      //if(n.nodeValue != '\n') {
      txt += n.nodeValue;
      //}
      break;
    }

    return txt;
  }
});
nicEditors.registerPlugin(nicXHTML);



var nicBBCode = bkClass.extend({
  construct: function(nicEditor) {
    this.ne = nicEditor;
    if (this.ne.options.bbCode) {
      nicEditor.addEvent('get', this.bbGet.closure(this));
      nicEditor.addEvent('set', this.bbSet.closure(this));

      var loadedPlugins = this.ne.loadedPlugins;
      for (var itm in loadedPlugins) {
        if (loadedPlugins[itm].toXHTML) {
          this.xhtml = loadedPlugins[itm];
        }
      }
    }
  },

  bbGet: function(ni) {
    var xhtml = this.xhtml.toXHTML(ni.getElm());
    ni.content = this.toBBCode(xhtml);
  },

  bbSet: function(ni) {
    ni.content = this.fromBBCode(ni.content);
  },

  toBBCode: function(xhtml) {
    function rp(r, m) {
      xhtml = xhtml.replace(r, m);
    }

    rp(/\n/gi, "");
    rp(/<strong>(.*?)<\/strong>/gi, "[b]$1[/b]");
    rp(/<em>(.*?)<\/em>/gi, "[i]$1[/i]");
    rp(/<span.*?style="text-decoration:underline;">(.*?)<\/span>/gi, "[u]$1[/u]");
    rp(/<ul>(.*?)<\/ul>/gi, "[list]$1[/list]");
    rp(/<li>(.*?)<\/li>/gi, "[*]$1[/*]");
    rp(/<ol>(.*?)<\/ol>/gi, "[list=1]$1[/list]");
    rp(/<img.*?src="(.*?)".*?>/gi, "[img]$1[/img]");
    rp(/<a.*?href="(.*?)".*?>(.*?)<\/a>/gi, "[url=$1]$2[/url]");
    rp(/<br.*?>/gi, "\n");
    rp(/<.*?>.*?<\/.*?>/gi, "");

    return xhtml;
  },

  fromBBCode: function(bbCode) {
    function rp(r, m) {
      bbCode = bbCode.replace(r, m);
    }

    rp(/\[b\](.*?)\[\/b\]/gi, "<strong>$1</strong>");
    rp(/\[i\](.*?)\[\/i\]/gi, "<em>$1</em>");
    rp(/\[u\](.*?)\[\/u\]/gi, "<span style=\"text-decoration:underline;\">$1</span>");
    rp(/\[list\](.*?)\[\/list\]/gi, "<ul>$1</ul>");
    rp(/\[list=1\](.*?)\[\/list\]/gi, "<ol>$1</ol>");
    rp(/\[\*\](.*?)\[\/\*\]/gi, "<li>$1</li>");
    rp(/\[img\](.*?)\[\/img\]/gi, "<img src=\"$1\" />");
    rp(/\[url=(.*?)\](.*?)\[\/url\]/gi, "<a href=\"$1\">$2</a>");
    rp(/\n/gi, "<br />");
    //rp(/\[.*?\](.*?)\[\/.*?\]/gi,"$1");

    return bbCode;
  }


});
nicEditors.registerPlugin(nicBBCode);



nicEditor = nicEditor.extend({
  floatingPanel: function() {
    this.floating = new bkElement('DIV').setStyle({
      position: 'absolute',
      top: '-1000px'
    }).appendTo(document.body);
    this.addEvent('focus', this.reposition.closure(this)).addEvent('blur', this.hide.closure(this));
    this.setPanel(this.floating);
  },

  reposition: function() {
    var e = this.selectedInstance.e;
    this.floating.setStyle({
      width: (parseInt(e.getStyle('width'), 10) || e.clientWidth) + 'px'
    });
    var top = e.offsetTop - this.floating.offsetHeight;
    if (top < 0) {
      top = e.offsetTop + e.offsetHeight;
    }

    this.floating.setStyle({
      top: top + 'px',
      left: e.offsetLeft + 'px',
      display: 'block'
    });
  },

  hide: function() {
    this.floating.setStyle({
      top: '-1000px'
    });
  }
});



/* START CONFIG */
var nicCodeOptions = {
  buttons: {
    'xhtml': {
      name: 'Edit HTML',
      type: 'nicCodeButton'
    }
  }

};
/* END CONFIG */

var nicCodeButton = nicEditorAdvancedButton.extend({
  width: '350px',

  addPane: function() {
    this.addForm({
      '': {
        type: 'title',
        txt: 'Edit HTML'
      },
      'code': {
        type: 'content',
        'value': this.ne.selectedInstance.getContent(),
        style: {
          width: '340px',
          height: '200px'
        }
      }
    });
  },

  submit: function(e) {
    var code = this.inputs['code'].value;
    this.ne.selectedInstance.setContent(code);
    this.removePane();
  }
});

nicEditors.registerPlugin(nicPlugin, nicCodeOptions);


/* My Custom Buttons are here.*/

/* Paint Tools */

/* START CONFIG */
var paintOptions = {
  buttons:{
      'paint': {
        name: __('Paint Pen(Enable/Disable text)'),
        type: 'nicEditorPaintButton'
       },
       'erase': {
           name: __('Eraser'),
           type: 'nicEditorEraserButton'
       },
       'pencolor': {
           name: __('Select Pen Color'),
           type: 'nicEditPenColorButton',
           noClose: true
       },
       'pensize': {
           name: __('Select Pen Size'),
           type: 'nicEditPenSizeButton',
           noClose: true
       }
  },
  iconFiles:{
       'paint': 'img/pen.gif',
       'erase': 'img/erase.gif',
       'pencolor': 'img/pencolor.gif',
       'pensize': 'img/pensize.gif'
  }
};
/* END CONFIG */

var nicEditorPaintButton = nicEditorButton.extend({
  mouseClick : function() {
      penClick();
  }
});

var nicEditorEraserButton = nicEditorButton.extend({
  mouseClick : function() {
      eraserClick();
  }
});

var nicEditPenColorButton = nicEditorAdvancedButton.extend({
  width: '100px',
  addPane: function() {
    var colorList = {
          0: '#ff0000',
          1: '#ff66ff',
          2: '#ffff00',
          3: '#0000ff',
          4: '#00cc33',
          5: '#cc00cc',
          6: '#000000',
          7: '#ffffff',
          8: '#ff9900'
      };
    var colorItems = new bkElement('DIV').setStyle({
      width: '90px'
    });
    
    for(var ci in colorList){
        
        var colorSquare = new bkElement('DIV').setStyle({
            'cursor': 'pointer',
            'height': '30px',
            'float': 'left'
        }).appendTo(colorItems);
        var colorBorder = new bkElement('DIV').setStyle({
            border: '2px solid ' + colorList[ci]
        }).appendTo(colorSquare);
        
        var colorInner = new bkElement('DIV').setStyle({
            backgroundColor: colorList[ci],
            overflow: 'hidden',
            width: '26px',
            height: '26px'
          }).addEvent('click', this.colorSelect.closure(this, colorList[ci])).addEvent('mouseover', this.on.closure(this, colorBorder)).addEvent('mouseout', this.off.closure(this, colorBorder, colorList[ci])).appendTo(colorBorder);
        if (!window.opera) {
            colorSquare.onmousedown = colorInner.onmousedown = bkLib.cancelEvent;
        }
    }
        
    this.pane.append(colorItems.noSelect());
  },
  
  colorSelect: function(c) {
    penColor = c;
    this.removePane();
  },

  on: function(colorBorder) {
    colorBorder.setStyle({
      border: '2px solid #000'
    });
  },

  off: function(colorBorder, colorCode) {
    colorBorder.setStyle({
      border: '2px solid ' + colorCode
    });
  }
});

var nicEditPenSizeButton = nicEditorAdvancedButton.extend({
  width: '70px',
  addPane: function() {
    var sizeList = {
          0: '1px',
          1: '3px',
          2: '9px',
          3: '18px',
          4: '27px'
      };
    var sizeItems = new bkElement('DIV').setStyle({
      width: '60px'
    });
    
    for(var si in sizeList){
        
        var sizeRectangle = new bkElement('DIV').setStyle({
            'cursor': 'pointer',
            'height': '30px',
            'float': 'left'
        }).appendTo(sizeItems);
        var sizeBorder = new bkElement('DIV').setStyle({
            border: '2px solid #ffffff'
        }).appendTo(sizeRectangle);
        
        var sizeInner = new bkElement('DIV').setStyle({
            backgroundColor: '#ffffff',
            overflow: 'hidden',
            width: '56px',
            height: '26px'
          }).addEvent('click', this.sizeSelect.closure(this, sizeList[si])).addEvent('mouseover', this.on.closure(this, sizeBorder)).addEvent('mouseout', this.off.closure(this, sizeBorder)).appendTo(sizeBorder);
        
        var sizeItem = new bkElement('DIV').setStyle({
            margin: 'auto',
            width: sizeList[si],
            height: sizeList[si],
            '-webkit-border-radius': (parseInt(sizeList[si], 10)/2)+'px',
            '-moz-border-radius': (parseInt(sizeList[si], 10)/2)+'px',
            'border-radius': (parseInt(sizeList[si], 10)/2)+'px',
            background: '#000000'
        }).appendTo(sizeInner);
        
        if (!window.opera) {
            sizeRectangle.onmousedown = sizeInner.onmousedown = bkLib.cancelEvent;
        }
    }
        
    this.pane.append(sizeItems.noSelect());
  },
  
  sizeSelect: function(c) {
    penSize = parseInt(c, 10);
    this.removePane();
  },

  on: function(colorBorder) {
    colorBorder.setStyle({
      border: '2px solid #000'
    });
  },

  off: function(colorBorder) {
    colorBorder.setStyle({
      border: '2px solid #ffffff'
    });
  }
});

nicEditors.registerPlugin(nicPlugin, paintOptions);

/*
 * 
 * Simliy 
 * Auto resize
 * 
 */

/* START CONFIG */
var smileyOptions = {
  buttons:{
      'smiley': {
        name: __('Add smiley'),
        type: 'nicEditorSmileyButton',
        noClose: true
       }
  },
  iconFiles:{
       'smiley': 'img/smiley.png'
  }
};
/* END CONFIG */

var nicEditorSmileyButton = nicEditorAdvancedButton.extend({
    width:'253px',
    init: function(){
        this.ne.addEvent('selected', this.removePane.closure(this)).addEvent('blur', this.removePane.closure(this));
        this.button.setStyle({
            backgroundSize: '18px 18px'
        });
    },
    addPane: function() {
        var smileys = {
              0: 'e1-0', 1: 'e1-1', 2: 'e1-2', 3: 'e1-3', 4: 'e1-4', 5: 'e1-5', 6: 'e1-6', 7: 'e1-7', 8: 'e1-8', 9: 'e1-9', 10: 'e1-10', 11: 'e1-11', 12: 'e1-12', 13: 'e1-13', 14: 'e1-14', 15: 'e1-15', 16: 'e1-16', 17: 'e1-17', 18: 'e1-18', 19: 'e1-19', 20: 'e1-20', 21: 'e1-21', 22: 'e1-22', 23: 'e1-23', 24: 'e1-24', 25: 'e1-25', 26: 'e1-26', 27: 'e1-27', 28: 'e1-28', 29: 'e1-29', 30: 'e1-30', 31: 'e1-31', 32: 'e1-32', 33: 'e1-33', 34: 'e1-34', 35: 'e1-35', 36: 'e1-36', 37: 'e1-37', 38: 'e1-38', 39: 'e1-39', 40: 'e1-40', 41: 'e1-41', 42: 'e1-42', 43: 'e1-43', 44: 'e1-44', 45: 'e1-45', 46: 'e1-46', 47: 'e1-47', 48: 'e1-48', 49: 'e1-49', 50: 'e1-50', 51: 'e1-51', 52: 'e1-52', 53: 'e1-53', 54: 'e1-54', 55: 'e1-55', 56: 'e1-56', 57: 'e1-57', 58: 'e1-58', 59: 'e1-59', 60: 'e1-60', 61: 'e1-61', 62: 'e1-62', 63: 'e1-63', 64: 'e1-64', 65: 'e1-65', 66: 'e1-66', 67: 'e1-67', 68: 'e1-68', 69: 'e1-69', 70: 'e1-70', 71: 'e1-71', 72: 'e1-72', 73: 'e1-73', 74: 'e1-74', 75: 'e1-75', 76: 'e1-76', 77: 'e1-77', 78: 'e1-78', 79: 'e1-79', 80: 'e1-80', 81: 'e1-81', 82: 'e1-82', 83: 'e1-83', 84: 'e1-84', 85: 'e1-85', 86: 'e1-86', 87: 'e1-87', 88: 'e1-88', 89: 'e1-89', 90: 'e1-90', 91: 'e1-91', 92: 'e1-92', 93: 'e1-93', 94: 'e1-94', 95: 'e1-95', 96: 'e1-96', 97: 'e1-97', 98: 'e1-98', 99: 'e1-99', 100: 'e1-100', 101: 'e1-101', 102: 'e1-102', 103: 'e1-103', 104: 'e1-104', 105: 'e1-105', 106: 'e1-106', 107: 'e1-107', 108: 'e1-108', 109: 'e1-109', 110: 'e1-110', 111: 'e1-111', 112: 'e1-112', 113: 'e1-113', 114: 'e1-114', 115: 'e1-115', 116: 'e1-116', 117: 'e1-117', 118: 'e1-118', 119: 'e1-119', 120: 'e1-120', 121: 'e1-121', 122: 'e1-122', 123: 'e1-123', 124: 'e1-124', 125: 'e1-125', 126: 'e1-126', 127: 'e1-127', 128: 'e1-128', 129: 'e1-129', 130: 'e1-130', 131: 'e1-131', 132: 'e1-132', 133: 'e1-133', 134: 'e1-134', 135: 'e1-135', 136: 'e1-136', 137: 'e1-137', 138: 'e1-138', 139: 'e1-139', 140: 'e1-140', 141: 'e1-141', 142: 'e1-142', 143: 'e1-143', 144: 'e1-144', 145: 'e1-145', 146: 'e1-146', 147: 'e1-147', 148: 'e1-148', 149: 'e1-149', 150: 'e1-150', 151: 'e1-151', 152: 'e1-152', 153: 'e1-153', 154: 'e1-154', 155: 'e1-155', 156: 'e1-156', 157: 'e1-157', 158: 'e1-158', 159: 'e1-159', 160: 'e1-160', 161: 'e1-161', 162: 'e1-162', 163: 'e1-163', 164: 'e1-164', 165: 'e1-165', 166: 'e1-166', 167: 'e1-167', 168: 'e1-168', 169: 'e1-169', 170: 'e1-170', 171: 'e1-171', 172: 'e1-172', 173: 'e1-173', 174: 'e1-174', 175: 'e1-175', 176: 'e1-176', 177: 'e1-177', 178: 'e1-178', 179: 'e1-179', 180: 'e1-180', 181: 'e1-181', 182: 'e1-182', 183: 'e1-183', 184: 'e1-184', 185: 'e1-185', 186: 'e1-186', 187: 'e1-187', 188: 'e1-188', 189: 'e1-189', 190: 'e1-190', 191: 'e1-191', 192: 'e1-192', 193: 'e1-193', 194: 'e1-194', 195: 'e1-195', 196: 'e1-196', 197: 'e1-197', 198: 'e1-198', 199: 'e1-199', 200: 'e1-200', 201: 'e1-201', 202: 'e1-202', 203: 'e1-203', 204: 'e1-204', 205: 'e1-205', 206: 'e1-206', 207: 'e1-207', 208: 'e1-208', 209: 'e1-209', 210: 'e1-210', 211: 'e1-211', 212: 'e1-212', 213: 'e1-213', 214: 'e1-214', 215: 'e1-215', 216: 'e1-216', 217: 'e1-217', 218: 'e1-218', 219: 'e1-219', 220: 'e1-220', 221: 'e1-221', 222: 'e1-222', 223: 'e1-223', 224: 'e1-224', 225: 'e1-225', 226: 'e1-226', 227: 'e1-227', 228: 'e1-228', 229: 'e1-229', 230: 'e1-230', 231: 'e1-231', 232: 'e1-232', 233: 'e1-233', 234: 'e1-234', 235: 'e1-235', 236: 'e1-236', 237: 'e1-237', 238: 'e1-238', 239: 'e1-239', 240: 'e1-240', 241: 'e1-241', 242: 'e1-242', 243: 'e1-243', 244: 'e1-244', 245: 'e1-245', 246: 'e1-246', 247: 'e1-247', 248: 'e1-248', 249: 'e1-249', 250: 'e1-250', 251: 'e1-251', 252: 'e1-252', 253: 'e1-253', 254: 'e1-254', 255: 'e1-255', 256: 'e1-256', 257: 'e1-257', 258: 'e1-258', 259: 'e1-259', 260: 'e1-260', 261: 'e1-261', 262: 'e1-262', 263: 'e1-263', 264: 'e1-264', 265: 'e1-265', 266: 'e1-266', 267: 'e1-267', 268: 'e1-268', 269: 'e1-269', 270: 'e1-270', 271: 'e1-271', 272: 'e1-272', 273: 'e1-273', 274: 'e1-274', 275: 'e1-275', 276: 'e1-276', 277: 'e1-277', 278: 'e1-278', 279: 'e1-279', 280: 'e1-280', 281: 'e1-281', 282: 'e1-282', 283: 'e1-283', 284: 'e1-284', 285: 'e1-285', 286: 'e1-286', 287: 'e1-287', 288: 'e1-288', 289: 'e1-289', 290: 'e1-290', 291: 'e2-0', 292: 'e2-1', 293: 'e2-2', 294: 'e2-3', 295: 'e2-4', 296: 'e2-5', 297: 'e2-6', 298: 'e2-7', 299: 'e2-8', 300: 'e2-9', 301: 'e2-10', 302: 'e2-11', 303: 'e2-12', 304: 'e2-13', 305: 'e2-14', 306: 'e2-15', 307: 'e2-16', 308: 'e2-17', 309: 'e2-18', 310: 'e2-19', 311: 'e2-20', 312: 'e2-21', 313: 'e2-22', 314: 'e2-23', 315: 'e2-24', 316: 'e2-25', 317: 'e2-26', 318: 'e2-27', 319: 'e2-28', 320: 'e2-29', 321: 'e2-30', 322: 'e2-31', 323: 'e2-32', 324: 'e2-33', 325: 'e2-34', 326: 'e2-35', 327: 'e2-36', 328: 'e2-37', 329: 'e2-38', 330: 'e2-39', 331: 'e2-40', 332: 'e2-41', 333: 'e2-42', 334: 'e2-43', 335: 'e2-44', 336: 'e2-45', 337: 'e2-46', 338: 'e2-47', 339: 'e2-48', 340: 'e2-49', 341: 'e2-50', 342: 'e2-51', 343: 'e2-52', 344: 'e2-53', 345: 'e2-54', 346: 'e2-55', 347: 'e2-56', 348: 'e2-57', 349: 'e2-58', 350: 'e2-59', 351: 'e2-60', 352: 'e2-61', 353: 'e2-62', 354: 'e2-63', 355: 'e2-64', 356: 'e2-65', 357: 'e2-66', 358: 'e2-67', 359: 'e2-68', 360: 'e2-69', 361: 'e2-70', 362: 'e2-71', 363: 'e2-72', 364: 'e2-73', 365: 'e2-74', 366: 'e2-75', 367: 'e2-76', 368: 'e2-77', 369: 'e2-78', 370: 'e2-79', 371: 'e2-80', 372: 'e2-81', 373: 'e2-82', 374: 'e2-83', 375: 'e2-84', 376: 'e2-85', 377: 'e3-0', 378: 'e3-1', 379: 'e3-2', 380: 'e3-3', 381: 'e3-4', 382: 'e3-5', 383: 'e3-6', 384: 'e3-7', 385: 'e3-8', 386: 'e3-9', 387: 'e3-10', 388: 'e3-11', 389: 'e3-12', 390: 'e3-13', 391: 'e3-14', 392: 'e3-15', 393: 'e3-16', 394: 'e3-17', 395: 'e3-18', 396: 'e3-19', 397: 'e3-20', 398: 'e3-21', 399: 'e3-22', 400: 'e3-23', 401: 'e3-24', 402: 'e3-25', 403: 'e3-26', 404: 'e3-27', 405: 'e3-28', 406: 'e3-29', 407: 'e3-30', 408: 'e3-31', 409: 'e3-32', 410: 'e3-33', 411: 'e3-34', 412: 'e3-35', 413: 'e3-36', 414: 'e3-37', 415: 'e3-38', 416: 'e3-39', 417: 'e3-40', 418: 'e3-41', 419: 'e3-42', 420: 'e3-43', 421: 'e3-44', 422: 'e3-45', 423: 'e3-46', 424: 'e3-47', 425: 'e3-48', 426: 'e3-49', 427: 'e3-50', 428: 'e3-51', 429: 'e3-52', 430: 'e3-53', 431: 'e3-54', 432: 'e3-55', 433: 'e3-56', 434: 'e3-57', 435: 'e3-58', 436: 'e3-59', 437: 'e3-60', 438: 'e3-61', 439: 'e3-62', 440: 'e3-63', 441: 'e3-64', 442: 'e3-65', 443: 'e3-66', 444: 'e3-67', 445: 'e3-68', 446: 'e3-69', 447: 'e3-70', 448: 'e3-71', 449: 'e3-72', 450: 'e3-73', 451: 'e3-74', 452: 'e3-75', 453: 'e3-76', 454: 'e3-77', 455: 'e3-78', 456: 'e3-79', 457: 'e3-80', 458: 'e3-81', 459: 'e3-82', 460: 'e3-83', 461: 'e3-84', 462: 'e3-85', 463: 'e3-86', 464: 'e3-87', 465: 'e3-88', 466: 'e3-89', 467: 'e3-90', 468: 'e3-91', 469: 'e3-92', 470: 'e3-93', 471: 'e3-94', 472: 'e3-95', 473: 'e3-96', 474: 'e3-97', 475: 'e3-98', 476: 'e3-99', 477: 'e3-100', 478: 'e3-101', 479: 'e3-102', 480: 'e3-103', 481: 'e3-104', 482: 'e3-105', 483: 'e3-106', 484: 'e3-107', 485: 'e3-108', 486: 'e3-109', 487: 'e3-110', 488: 'e3-111', 489: 'e3-112', 490: 'e3-113', 491: 'e3-114', 492: 'e3-115', 493: 'e3-116', 494: 'e3-117', 495: 'e3-118', 496: 'e3-119', 497: 'e3-120', 498: 'e3-121', 499: 'e3-122', 500: 'e3-123', 501: 'e3-124', 502: 'e3-125', 503: 'e3-126', 504: 'e3-127', 505: 'e3-128', 506: 'e3-129', 507: 'e3-130', 508: 'e3-131', 509: 'e3-132', 510: 'e3-133', 511: 'e3-134', 512: 'e3-135', 513: 'e3-136', 514: 'e3-137', 515: 'e3-138', 516: 'e3-139', 517: 'e3-140', 518: 'e3-141', 519: 'e3-142', 520: 'e3-143', 521: 'e3-144', 522: 'e3-145', 523: 'e3-146', 524: 'e3-147', 525: 'e3-148', 526: 'e3-149', 527: 'e3-150', 528: 'e3-151', 529: 'e3-152', 530: 'e3-153', 531: 'e3-154', 532: 'e3-155', 533: 'e3-156', 534: 'e3-157', 535: 'e3-158', 536: 'e3-159', 537: 'e3-160', 538: 'e3-161', 539: 'e3-162', 540: 'e3-163', 541: 'e3-164', 542: 'e3-165', 543: 'e3-166', 544: 'e3-167', 545: 'e3-168', 546: 'e3-169', 547: 'e3-170', 548: 'e3-171', 549: 'e3-172', 550: 'e3-173', 551: 'e3-174', 552: 'e3-175', 553: 'e3-176', 554: 'e3-177', 555: 'e3-178', 556: 'e3-179', 557: 'e3-180', 558: 'e3-181', 559: 'e3-182', 560: 'e3-183', 561: 'e3-184', 562: 'e3-185', 563: 'e3-186', 564: 'e3-187', 565: 'e3-188', 566: 'e3-189', 567: 'e3-190', 568: 'e3-191', 569: 'e3-192', 570: 'e3-193', 571: 'e3-194', 572: 'e3-195', 573: 'e3-196', 574: 'e3-197', 575: 'e3-198', 576: 'e3-199', 577: 'e3-200', 578: 'e3-201', 579: 'e3-202', 580: 'e3-203', 581: 'e3-204', 582: 'e3-205', 583: 'e3-206', 584: 'e3-207', 585: 'e3-208', 586: 'e3-209', 587: 'e3-210', 588: 'e3-211', 589: 'e3-212', 590: 'e3-213', 591: 'e3-214', 592: 'e3-215', 593: 'e3-216', 594: 'e3-217', 595: 'e3-218', 596: 'e3-219', 597: 'e3-220', 598: 'e3-221', 599: 'e3-222', 600: 'e3-223', 601: 'e3-224', 602: 'e3-225', 603: 'e3-226', 604: 'e3-227', 605: 'e3-228', 606: 'e3-229', 607: 'e3-230', 608: 'e3-231', 609: 'e3-232', 610: 'e3-233', 611: 'e3-234', 612: 'e3-235', 613: 'e3-236', 614: 'e3-237', 615: 'e3-238', 616: 'e3-239', 617: 'e3-240', 618: 'e3-241', 619: 'e3-242', 620: 'e3-243', 621: 'e3-244', 622: 'e3-245', 623: 'e3-246', 624: 'e3-247', 625: 'e3-248', 626: 'e3-249', 627: 'e3-250', 628: 'e3-251', 629: 'e3-252', 630: 'e3-253', 631: 'e3-254', 632: 'e3-255', 633: 'e3-256', 634: 'e3-257', 635: 'e3-258', 636: 'e3-259', 637: 'e3-260', 638: 'e3-261', 639: 'e3-262', 640: 'e3-263', 641: 'e3-264', 642: 'e3-265', 643: 'e3-266', 644: 'e3-267', 645: 'e3-268', 646: 'e3-269', 647: 'e3-270', 648: 'e3-271', 649: 'e4-0', 650: 'e4-1', 651: 'e4-2', 652: 'e4-3', 653: 'e4-4', 654: 'e4-5', 655: 'e4-6', 656: 'e4-7', 657: 'e4-8', 658: 'e4-9', 659: 'e4-10', 660: 'e4-11', 661: 'e4-12', 662: 'e4-13', 663: 'e4-14', 664: 'e4-15', 665: 'e4-16', 666: 'e4-17', 667: 'e4-18', 668: 'e4-19', 669: 'e4-20', 670: 'e4-21', 671: 'e4-22', 672: 'e4-23', 673: 'e4-24', 674: 'e4-25', 675: 'e4-26', 676: 'e4-27', 677: 'e4-28', 678: 'e4-29', 679: 'e4-30', 680: 'e4-31', 681: 'e4-32', 682: 'e4-33', 683: 'e4-34', 684: 'e4-35', 685: 'e4-36', 686: 'e4-37', 687: 'e4-38', 688: 'e4-39', 689: 'e4-40', 690: 'e4-41', 691: 'e4-42', 692: 'e4-43', 693: 'e4-44', 694: 'e4-45', 695: 'e4-46', 696: 'e4-47', 697: 'e4-48', 698: 'e4-49', 699: 'e4-50', 700: 'e4-51', 701: 'e4-52', 702: 'e4-53', 703: 'e4-54', 704: 'e4-55', 705: 'e4-56', 706: 'e4-57', 707: 'e4-58', 708: 'e4-59', 709: 'e4-60', 710: 'e4-61', 711: 'e4-62', 712: 'e4-63', 713: 'e4-64', 714: 'e4-65', 715: 'e4-66', 716: 'e4-67', 717: 'e4-68', 718: 'e4-69', 719: 'e4-70', 720: 'e4-71', 721: 'e4-72', 722: 'e4-73', 723: 'e4-74', 724: 'e4-75', 725: 'e4-76', 726: 'e4-77', 727: 'e4-78', 728: 'e4-79', 729: 'e4-80', 730: 'e4-81', 731: 'e4-82', 732: 'e4-83', 733: 'e4-84', 734: 'e4-85', 735: 'e4-86', 736: 'e4-87', 737: 'e4-88', 738: 'e4-89', 739: 'e4-90', 740: 'e4-91', 741: 'e4-92', 742: 'e4-93', 743: 'e4-94', 744: 'e4-95', 745: 'e4-96', 746: 'e4-97', 747: 'e4-98', 748: 'e4-99', 749: 'e4-100', 750: 'e4-101', 751: 'e4-102', 752: 'e4-103', 753: 'e4-104', 754: 'e4-105', 755: 'e4-106', 756: 'e4-107', 757: 'e4-108', 758: 'e4-109', 759: 'e4-110', 760: 'e4-111', 761: 'e4-112', 762: 'e4-113', 763: 'e4-114', 764: 'e4-115', 765: 'e4-116', 766: 'e4-117', 767: 'e4-118', 768: 'e4-119', 769: 'e4-120', 770: 'e4-121', 771: 'e4-122', 772: 'e4-123', 773: 'e4-124', 774: 'e4-125', 775: 'e4-126', 776: 'e4-127', 777: 'e4-128', 778: 'e4-129', 779: 'e4-130', 780: 'e4-131', 781: 'e4-132', 782: 'e4-133', 783: 'e4-134', 784: 'e4-135', 785: 'e4-136', 786: 'e4-137', 787: 'e4-138', 788: 'e4-139', 789: 'e4-140', 790: 'e4-141', 791: 'e4-142', 792: 'e4-143', 793: 'e4-144', 794: 'e4-145', 795: 'e4-146', 796: 'e4-147', 797: 'e4-148', 798: 'e4-149', 799: 'e4-150', 800: 'e4-151', 801: 'e4-152', 802: 'e4-153', 803: 'e4-154', 804: 'e4-155', 805: 'e4-156', 806: 'e4-157', 807: 'e4-158', 808: 'e5-0', 809: 'e5-1', 810: 'e5-2', 811: 'e5-3', 812: 'e5-4', 813: 'e5-5', 814: 'e5-6', 815: 'e5-7', 816: 'e5-8', 817: 'e5-9', 818: 'e5-10', 819: 'e5-11', 820: 'e5-12', 821: 'e5-13', 822: 'e5-14', 823: 'e5-15', 824: 'e5-16', 825: 'e5-17', 826: 'e5-18', 827: 'e5-19', 828: 'e5-20', 829: 'e5-21', 830: 'e5-22', 831: 'e5-23', 832: 'e5-24', 833: 'e5-25', 834: 'e5-26', 835: 'e5-27', 836: 'e5-28', 837: 'e5-29', 838: 'e5-30', 839: 'e5-31', 840: 'e5-32', 841: 'e5-33', 842: 'e5-34', 843: 'e5-35', 844: 'e5-36', 845: 'e5-37', 846: 'e5-38', 847: 'e5-39', 848: 'e5-40', 849: 'e5-41', 850: 'e5-42', 851: 'e5-43', 852: 'e5-44', 853: 'e5-45', 854: 'e5-46', 855: 'e5-47', 856: 'e5-48', 857: 'e5-49', 858: 'e5-50', 859: 'e5-51', 860: 'e5-52', 861: 'e5-53', 862: 'e5-54', 863: 'e5-55', 864: 'e5-56', 865: 'e5-57', 866: 'e5-58', 867: 'e5-59', 868: 'e5-60', 869: 'e5-61', 870: 'e5-62', 871: 'e5-63', 872: 'e5-64', 873: 'e5-65', 874: 'e5-66', 875: 'e5-67', 876: 'e5-68', 877: 'e5-69', 878: 'e5-70', 879: 'e5-71', 880: 'e5-72', 881: 'e5-73', 882: 'e5-74', 883: 'e5-75', 884: 'e5-76', 885: 'e5-77', 886: 'e5-78', 887: 'e5-79', 888: 'e5-80', 889: 'e5-81', 890: 'e5-82', 891: 'e5-83', 892: 'e5-84', 893: 'e5-85', 894: 'e5-86', 895: 'e5-87', 896: 'e5-88', 897: 'e5-89', 898: 'e5-90', 899: 'e5-91', 900: 'e5-92', 901: 'e5-93', 902: 'e5-94', 903: 'e5-95', 904: 'e5-96', 905: 'e5-97', 906: 'e5-98', 907: 'e5-99', 908: 'e5-100', 909: 'e5-101', 910: 'e5-102', 911: 'e5-103', 912: 'e5-104', 913: 'e5-105', 914: 'e5-106', 915: 'e5-107', 916: 'e5-108', 917: 'e5-109', 918: 'e5-110', 919: 'e5-111', 920: 'e5-112', 921: 'e5-113', 922: 'e5-114', 923: 'e5-115', 924: 'e5-116', 925: 'e5-117', 926: 'e5-118', 927: 'e6-0', 928: 'e6-1', 929: 'e6-2', 930: 'e6-3', 931: 'e6-4', 932: 'e6-5', 933: 'e6-6', 934: 'e6-7', 935: 'e6-8', 936: 'e6-9', 937: 'e6-10', 938: 'e6-11', 939: 'e6-12', 940: 'e6-13', 941: 'e6-14', 942: 'e6-15', 943: 'e6-16', 944: 'e6-17', 945: 'e6-18', 946: 'e6-19', 947: 'e6-20', 948: 'e6-21', 949: 'e6-22', 950: 'e6-23', 951: 'e6-24', 952: 'e6-25', 953: 'e6-26', 954: 'e6-27', 955: 'e6-28', 956: 'e6-29', 957: 'e6-30', 958: 'e6-31', 959: 'e6-32', 960: 'e6-33', 961: 'e6-34', 962: 'e6-35', 963: 'e6-36', 964: 'e6-37', 965: 'e6-38', 966: 'e6-39', 967: 'e6-40', 968: 'e6-41', 969: 'e6-42', 970: 'e6-43', 971: 'e6-44', 972: 'e6-45', 973: 'e6-46', 974: 'e6-47', 975: 'e6-48', 976: 'e6-49', 977: 'e6-50', 978: 'e6-51', 979: 'e6-52', 980: 'e6-53', 981: 'e6-54', 982: 'e6-55', 983: 'e6-56', 984: 'e6-57', 985: 'e6-58', 986: 'e6-59', 987: 'e6-60', 988: 'e6-61', 989: 'e6-62', 990: 'e6-63', 991: 'e6-64', 992: 'e6-65', 993: 'e6-66', 994: 'e6-67', 995: 'e6-68', 996: 'e6-69', 997: 'e6-70', 998: 'e6-71', 999: 'e6-72', 1000: 'e6-73', 1001: 'e6-74', 1002: 'e6-75', 1003: 'e6-76', 1004: 'e6-77', 1005: 'e6-78', 1006: 'e6-79'
        };
        var smileyItems = new bkElement('DIV').setStyle({
            width: '248px',
            height: '200px',
            overflowY: 'scroll',
            overflowX: 'hidden'
        });
        
        for(var si in smileys){
            var sizeRectangle = new bkElement('DIV').setStyle({
                'cursor': 'pointer',
                'height': '25px',
                'float': 'left'
            }).appendTo(smileyItems);
            var sizeBorder = new bkElement('DIV').setStyle({
                border: '2px solid #ffffff'
            }).appendTo(sizeRectangle);
            var sizeInner = new bkElement('DIV').setStyle({
                backgroundColor: '#ffffff',
                overflow: 'hidden',
                width: '21px',
                height: '21px'
              }).addEvent('click', this.selectSmiley.closure(this, smileys[si])).addEvent('mouseover', this.on.closure(this, sizeBorder)).addEvent('mouseout', this.off.closure(this, sizeBorder)).appendTo(sizeBorder);

            var sizeItem = new bkElement('IMG').addMyClass(smileys[si]).appendTo(sizeInner);

            if (!window.opera) {
                sizeRectangle.onmousedown = sizeInner.onmousedown = bkLib.cancelEvent;
            }
        }
        this.pane.append(smileyItems.noSelect());
    },
    
    selectSmiley: function(c) {
        this.ne.nicCommand("insertHTML",' <img class="'+c+'" style="resize: none;" draggable="false"> ');
        this.removePane();
    },
    
    on: function(colorBorder) {
      colorBorder.setStyle({
        border: '2px solid #000'
      });
    },

    off: function(colorBorder) {
      colorBorder.setStyle({
        border: '2px solid #ffffff'
      });
    }
      
});

nicEditors.registerPlugin(nicPlugin, smileyOptions);


/*
* Others declarations here
 */

var NicEditor = new nicEditor({fullPanel : true});

NicEditor.setPanel('panel');
NicEditor.addInstance('textarea');
$("div.nicEdit-main").addClass('wordwrap'); 

$('#workText').keyup(function(e){
    if($('#workText').height() != $('#canvasArea').height())
    {
        console.log($('#workText').height())
        //$('#canvasArea').height($('#workText').height());
        document.getElementById('canvasArea').height = $('#workText').height();
        $('#workImage').height($('#workText').height());
    }
}); 

$('#workText').mousedown(function(e){
    if(pen || erase)
    {
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, false);
        redraw();
        paint = true;
        $('.nicEdit-main').attr('contenteditable','false');
    }
}); 

$('#workText').mousemove(function(e){
    if(paint & pen || erase & paint)
    {
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        redraw();
    }
});

$('#workText').mouseup(function(e){
    if(pen || erase)paint = false;
    clickX.length = 0;
    clickY.length = 0;
    $('.nicEdit-main').attr('contenteditable','true');
});


document.getElementById('workText').addEventListener('touchstart', function(e){    
    if(pen || erase)
    {
        addClick(e.changedTouches[0].pageX - this.offsetLeft, e.changedTouches[0].pageY - this.offsetTop, false);
        redraw();
        paint = true;
        event.preventDefault();
    }
},false);

document.getElementById('workText').addEventListener('touchmove', function(e){
    if(paint & pen || erase & paint)
    {
        addClick(e.changedTouches[0].pageX - this.offsetLeft, e.changedTouches[0].pageY - this.offsetTop, true);
        redraw();
        event.preventDefault();
    }
},false);

document.getElementById('workText').addEventListener('touchend', function(e){
    if(pen || erase){paint = false; event.preventDefault();}
    clickX.length = 0;
    clickY.length = 0;
},false);

function penClick()
{
    pen = !(pen);
    erase = false;
}

function eraserClick()
{
    erase = !(erase);
    pen = false;
}

function addClick(x, y, dragging)
{
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

function redraw(){
  ctx.strokeStyle = penColor;
  ctx.lineJoin = "round";
  ctx.lineWidth = penSize;
  if(erase) ctx.globalCompositeOperation = 'destination-out';
  else if(pen) ctx.globalCompositeOperation = 'source-over';
  
  for(var i=0; i < clickX.length; i++) {		
    ctx.beginPath();
    if(clickDrag[i] && i){
      ctx.moveTo(clickX[i-1], clickY[i-1]);
     }else{
       ctx.moveTo(clickX[i]-1, clickY[i]);
     }
     ctx.lineTo(clickX[i], clickY[i]);
     ctx.closePath();
     ctx.stroke();
  }
}
