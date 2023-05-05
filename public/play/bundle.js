(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var CheckersGame = require("./CheckersGame");
var CheckersAi = /*#__PURE__*/function () {
  function CheckersAi(game) {
    var _this = this;
    _classCallCheck(this, CheckersAi);
    this.game = game;
    this.maxDepth = 6;
    this.maxValue = function (state, a, b, depth) {
      if (state.getWinner() || state.isDraw() || depth == _this.maxDepth) {
        return [null, _this.getBoardEvaluation(state)];
      }
      var v = -Infinity;
      var moveToReturn = null;
      for (var i = 1; i <= 32; i++) {
        var moves = state.getPlayableMovesByPosition(i);
        for (var j = 0; j < moves.length; j++) {
          var move = moves[j];
          // make move
          var _move$shortNotation$s = move.shortNotation.split(/x|-/),
            _move$shortNotation$s2 = _slicedToArray(_move$shortNotation$s, 2),
            origin = _move$shortNotation$s2[0],
            dst = _move$shortNotation$s2[1];
          var longNotation = move.longNotation;
          state.doMove(origin, dst, longNotation);
          var _this$minValue = _this.minValue(state, a, b, depth + 1),
            _this$minValue2 = _slicedToArray(_this$minValue, 2),
            _ = _this$minValue2[0],
            evaluation = _this$minValue2[1];
          v = Math.max(v, evaluation);

          // unmake move
          state.undoLastMove();
          if (v >= b) {
            return [move, v];
          }
          if (moveToReturn === null) {
            moveToReturn = move;
          }
          if (v > a) {
            a = v;
            moveToReturn = move;
          }
        }
      }
      return [moveToReturn, v];
    };
    this.minValue = function (state, a, b, depth) {
      if (state.getWinner() || state.isDraw() || depth == _this.maxDepth) {
        return [null, _this.getBoardEvaluation(state)];
      }
      var v = Infinity;
      var moveToReturn = null;
      for (var i = 1; i <= 32; i++) {
        var moves = state.getPlayableMovesByPosition(i);
        for (var j = 0; j < moves.length; j++) {
          var move = moves[j];
          // make move
          var _move$shortNotation$s3 = move.shortNotation.split(/x|-/),
            _move$shortNotation$s4 = _slicedToArray(_move$shortNotation$s3, 2),
            origin = _move$shortNotation$s4[0],
            dst = _move$shortNotation$s4[1];
          var longNotation = move.longNotation;
          state.doMove(origin, dst, longNotation);
          var _this$maxValue = _this.maxValue(state, a, b, depth + 1),
            _this$maxValue2 = _slicedToArray(_this$maxValue, 2),
            _ = _this$maxValue2[0],
            evaluation = _this$maxValue2[1];
          v = Math.min(v, evaluation);

          // unmake move
          state.undoLastMove();
          if (v <= a) {
            return [move, v];
          }
          if (moveToReturn === null) {
            moveToReturn = move;
          }
          if (v < b) {
            b = v;
            moveToReturn = move;
          }
        }
      }
      return [moveToReturn, v];
    };
  }
  _createClass(CheckersAi, [{
    key: "getBoardEvaluation",
    value: function getBoardEvaluation(state) {
      var winner = state.getWinner();
      if (winner) {
        return winner == CheckersGame.PLAYER_BLACK ? Infinity : -Infinity;
      }
      if (state.isDraw()) {
        return 0;
      }
      var utility = 0;
      for (var i = 1; i <= 32; i++) {
        var piece = state.getPieceAtPosition(i);
        if (piece) {
          var pieceVal = piece.color === CheckersGame.PLAYER_BLACK ? 1 : -1;
          if (piece.isKing) {
            pieceVal *= 2;
          }
          utility += pieceVal;
        }
      }
      return utility;
    }
  }, {
    key: "getNextMove",
    value: function getNextMove() {
      if (this.game.turn == CheckersGame.PLAYER_BLACK) {
        return this.maxValue(this.game, -Infinity, Infinity, 0);
      } else {
        return this.minValue(this.game, -Infinity, Infinity, 0);
      }
    }
  }]);
  return CheckersAi;
}();
module.exports = CheckersAi;

},{"./CheckersGame":3}],2:[function(require,module,exports){
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var CheckersGame = require('./CheckersGame');
var CheckersAi = require('./CheckersAi');
var MoveOptions = /*#__PURE__*/function () {
  function MoveOptions() {
    _classCallCheck(this, MoveOptions);
    this.root = {
      val: null,
      children: {}
    };
    this.leaves = {};
  }
  _createClass(MoveOptions, [{
    key: "insertMove",
    value: function insertMove(move) {
      var subJumps = move.longNotation.split(/x|-/);
      var ptr = this.root;
      for (var i = 0; i < subJumps.length; i++) {
        if (!(subJumps[i] in ptr.children)) {
          ptr.children[subJumps[i]] = {
            val: subJumps[i],
            move: null,
            children: {}
          };
        }
        ptr = ptr.children[subJumps[i]];
      }
      ptr.move = move;
      var dst = subJumps[subJumps.length - 1];
      this.leaves[dst] = this.leaves[dst] ? this.leaves[dst] + 1 : 1;
    }
  }]);
  return MoveOptions;
}();
var CheckersBoard = /*#__PURE__*/function (_HTMLElement) {
  _inherits(CheckersBoard, _HTMLElement);
  var _super = _createSuper(CheckersBoard);
  function CheckersBoard() {
    var _this;
    _classCallCheck(this, CheckersBoard);
    _this = _super.call(this);
    _this.attachShadow({
      mode: 'open'
    });
    _this.shadowRoot.innerHTML = "<link rel=\"stylesheet\" href=\"/board_styles.css\" />";
    _this.game = new CheckersGame();
    _this.moveOptions = null;
    _this.moveOptionsPtr = null;
    _this.ai = new CheckersAi(_this.game);
    var color = _this.getAttribute('color') || 'b';
    _this.color = color;
    _this.isLocked = false;
    _this.showNumbers = false;
    _this.lastMove = [];
    _this.bestMove = [];
    var div = document.createElement("div");
    _this.createDiv(div);
    _this.drawBoard();
    _this.game.start();
    return _this;
  }
  _createClass(CheckersBoard, [{
    key: "toggleNumbers",
    value: function toggleNumbers() {
      this.showNumbers = !this.showNumbers;
      this.drawBoard();
    }
  }, {
    key: "getFen",
    value: function getFen() {
      return this.game.getFen();
    }
  }, {
    key: "getEval",
    value: function getEval() {
      return this.ai.getNextMove();
    }
  }, {
    key: "undoLastMove",
    value: function undoLastMove() {
      this.game.undoLastMove();
      _get(_getPrototypeOf(CheckersBoard.prototype), "drawBoard", this).call(this);
    }
  }, {
    key: "lockBoard",
    value: function lockBoard() {
      this.isLocked = true;
    }
  }, {
    key: "drawBoard",
    value: function drawBoard() {
      for (var i = 1; i <= 32; i++) {
        var _pieceDiv$classList;
        var squareDiv = this.shadowRoot.querySelector("[data-pos=\"".concat(i, "\"]"));
        squareDiv.classList.toggle('last-move', this.lastMove.includes("".concat(i)));
        squareDiv.classList.toggle('best-move', this.bestMove.includes("".concat(i)));
        var positionDiv = squareDiv.firstChild;
        positionDiv.classList.toggle('is-visible', this.showNumbers);
        var pieceDiv = squareDiv.children[1];
        (_pieceDiv$classList = pieceDiv.classList).remove.apply(_pieceDiv$classList, _toConsumableArray(pieceDiv.classList));
        pieceDiv.setAttribute('data-cy', '');
        var piece = this.game.getPieceAtPosition(i);
        if (piece) {
          var dataCy = 'piece';
          pieceDiv.classList.add("piece");
          pieceDiv.classList.add(piece.color === CheckersGame.PLAYER_BLACK ? "black" : "white");
          dataCy += piece.color === CheckersGame.PLAYER_BLACK ? " black" : " white";
          pieceDiv.classList.toggle("king", piece.isKing);
          dataCy += piece.isKing ? " king" : "";
          pieceDiv.setAttribute('data-cy', dataCy);
          if (piece.isKing && !pieceDiv.querySelector('img')) {
            var crownImg = document.createElement('img');
            crownImg.setAttribute('src', "/images/crown-".concat(piece.color === CheckersGame.PLAYER_BLACK ? 'white' : 'black', ".png"));
            crownImg.draggable = false;
            pieceDiv.appendChild(crownImg);
          }
        } else {
          pieceDiv.innerHTML = '';
        }
      }
    }
  }, {
    key: "createDiv",
    value: function createDiv(div) {
      var _this2 = this;
      var pieceCount = 0;
      for (var row = 0; row < 8; row++) {
        var _loop = function _loop() {
          var squareDiv = document.createElement("div");
          var positionDiv = document.createElement("div");
          positionDiv.classList.add('number');
          positionDiv.classList.toggle('is-visible', _this2.showNumbers);
          if (row % 2 !== col % 2) {
            var pos = _this2.color === CheckersGame.PLAYER_WHITE ? pieceCount + 1 : 32 - pieceCount;
            positionDiv.textContent = pos;
            squareDiv.appendChild(positionDiv);
            pieceCount++;
            squareDiv.setAttribute("data-pos", pos);
            squareDiv.setAttribute("data-cy", "square-".concat(pos));
            var that = _this2;
            squareDiv.onclick = function () {
              that.clickSquare(squareDiv.getAttribute("data-pos"));
            };
            squareDiv.ondragover = function (e) {
              e.preventDefault();
            };
            squareDiv.ondrop = function (e) {
              e.preventDefault();
              squareDiv.click();
            };
            var pieceDiv = document.createElement("div");
            pieceDiv.draggable = true;
            pieceDiv.ondragstart = function () {
              squareDiv.click();
            };
            pieceDiv.ondrag = function (e) {
              e.preventDefault();
            };
            squareDiv.appendChild(pieceDiv);
          }
          div.appendChild(squareDiv);
        };
        for (var col = 0; col < 8; col++) {
          _loop();
        }
      }
      div.setAttribute("id", "gameboard");
      div.setAttribute("data-cy", "gameboard");
      this.shadowRoot.appendChild(div);
    }
  }, {
    key: "setBoardFromFen",
    value: function setBoardFromFen(fen) {
      this.game.constructFromFen(fen);
      this.drawBoard();
    }
  }, {
    key: "clickSquare",
    value: function clickSquare(position) {
      var _this3 = this;
      for (var i = 1; i <= 32; i++) {
        var squareDiv = this.shadowRoot.querySelector("[data-pos=\"".concat(i, "\"]")).children[1];
        squareDiv.classList.remove("highlight");
        squareDiv.setAttribute('data-cy', squareDiv.getAttribute('data-cy').replace('highlight', ''));
      }
      var destinationSquares = [];
      if (this.moveOptions) {
        if (Object.keys(this.moveOptionsPtr.children).includes(position)) {
          this.moveOptionsPtr = this.moveOptionsPtr.children[position];
          while (Object.keys(this.moveOptionsPtr.children).length == 1) {
            var children = this.moveOptionsPtr.children;
            this.moveOptionsPtr = children[Object.values(children)[0].val];
          }
          destinationSquares = Object.values(this.moveOptionsPtr.children).map(function (obj) {
            return obj.val;
          });
          if (destinationSquares.length == 0) {
            var dst = this.moveOptionsPtr.val;
            var origin = this.moveOptionsPtr.move.shortNotation.split(/-|x/)[0];
            var isLongNotationNeeded = this.moveOptions.leaves[dst] > 1;
            var moveText = '';
            if (isLongNotationNeeded) {
              this.game.doMove(origin, dst, this.moveOptionsPtr.move.longNotation);
              moveText = this.moveOptionsPtr.move.longNotation;
            } else {
              this.game.doMove(origin, dst);
              moveText = this.moveOptionsPtr.move.shortNotation;
            }
            this.lastMove = [origin, dst];
            var moveEvent = new CustomEvent('move', {
              bubbles: true,
              detail: {
                moveText: moveText
              }
            });
            this.dispatchEvent(moveEvent);
            this.drawBoard();
            this.moveOptionsPtr = null;
            this.moveOptions = null;
            if (this.game.getWinner()) {
              var text = this.game.getWinner() === CheckersGame.PLAYER_BLACK ? "Black Wins!" : "White Wins!";
              var winEvent = new CustomEvent('win', {
                bubbles: true,
                detail: {
                  text: text
                }
              });
              this.dispatchEvent(winEvent);
            }
          }
        } else {
          this.moveOptionsPtr = null;
          this.moveOptions = null;
        }
      } else if (!this.isLocked && this.game.getPieceAtPosition(position) && this.game.getPieceAtPosition(position).color === this.color) {
        var validMoves = this.game.getPlayableMovesByPosition(position);
        if (validMoves.length > 0) {
          this.moveOptions = new MoveOptions();
          this.moveOptionsPtr = this.moveOptions.root;
          validMoves.forEach(function (move) {
            return _this3.moveOptions.insertMove(move);
          });
          this.moveOptionsPtr = this.moveOptionsPtr.children[position];
          destinationSquares = Object.values(this.moveOptionsPtr.children).map(function (obj) {
            return obj.val;
          });
        }
      }
      destinationSquares.forEach(function (ds) {
        var squareDiv = _this3.shadowRoot.querySelector("[data-pos=\"".concat(ds, "\"]")).children[1];
        squareDiv.classList.add("highlight");
        squareDiv.setAttribute('data-cy', squareDiv.getAttribute('data-cy') + " highlight");
      });
    }
  }]);
  return CheckersBoard;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));
customElements.define('checkers-board', CheckersBoard);
module.exports = CheckersBoard;

},{"./CheckersAi":1,"./CheckersGame":3}],3:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Piece = require('./Piece');

//import {Piece } from "./Piece.js";
var CheckersGame = /*#__PURE__*/_createClass(function CheckersGame() {
  var _this = this;
  _classCallCheck(this, CheckersGame);
  this.players = new Array(CheckersGame.NUM_PLAYERS);
  var board = {};
  var stateStack = [];
  for (var i = 1; i <= 32; i++) {
    if (i < 13) {
      board["" + i] = new Piece("b");
    } else if (i < 21) {
      board["" + i] = null;
    } else {
      board["" + i] = new Piece("w");
    }
  }
  var getFen = function getFen() {
    var whitePieces = [];
    var blackPieces = [];
    for (var _i = 1; _i <= 32; _i++) {
      if (board[_i]) {
        var king = board[_i].isKing ? 'K' : '';
        if (board[_i].color === CheckersGame.PLAYER_WHITE) {
          whitePieces.push(king + _i);
        } else if (board[_i]) {
          blackPieces.push(king + _i);
        }
      }
    }
    var turn = _this.turn === CheckersGame.PLAYER_WHITE ? 'W' : 'B';
    return "".concat(turn, ":W").concat(whitePieces.join(','), ":B").concat(blackPieces.join(','));
  };
  var getPlayableMovesByPos = function getPlayableMovesByPos(pos) {
    pos = parseInt(pos);
    var possibleJumps = getPlayableJumpMoves();
    if (possibleJumps.length > 0) {
      return possibleJumps.filter(function (jumpMove) {
        return jumpMove.shortNotation.split("x")[0] == pos;
      });
    }
    var possibleMoves = [];
    var movingPiece = board[pos];
    if (!movingPiece || movingPiece.color != _this.turn) {
      return [];
    }
    if (movingPiece.color === CheckersGame.PLAYER_BLACK || movingPiece.isKing) {
      var row = Math.floor((pos - 1) / 4);
      if (row % 2 === 0) {
        if (pos + 4 <= 32 && board[pos + 4] === null) {
          possibleMoves = possibleMoves.concat({
            shortNotation: "".concat(pos, "-").concat(pos + 4),
            longNotation: "".concat(pos, "-").concat(pos + 4),
            capturedPieces: []
          });
        }
        if (pos + 5 <= 32 && pos % 8 !== 4 && board[pos + 5] === null) {
          possibleMoves = possibleMoves.concat({
            shortNotation: "".concat(pos, "-").concat(pos + 5),
            longNotation: "".concat(pos, "-").concat(pos + 5),
            capturedPieces: []
          });
        }
      } else {
        if (pos + 4 <= 32 && board[pos + 4] === null) {
          possibleMoves = possibleMoves.concat({
            shortNotation: "".concat(pos, "-").concat(pos + 4),
            longNotation: "".concat(pos, "-").concat(pos + 4),
            capturedPieces: []
          });
        }
        if (pos + 3 <= 32 && pos % 8 !== 5 && board[pos + 3] === null) {
          possibleMoves = possibleMoves.concat({
            shortNotation: "".concat(pos, "-").concat(pos + 3),
            longNotation: "".concat(pos, "-").concat(pos + 3),
            capturedPieces: []
          });
        }
      }
    }
    if (movingPiece.color === CheckersGame.PLAYER_WHITE || movingPiece.isKing) {
      var _row = Math.floor((pos - 1) / 4);
      if (_row % 2 === 0) {
        if (pos - 4 >= 1 && board[pos - 4] === null) {
          possibleMoves = possibleMoves.concat({
            shortNotation: "".concat(pos, "-").concat(pos - 4),
            longNotation: "".concat(pos, "-").concat(pos - 4),
            capturedPieces: []
          });
        }
        if (pos - 3 >= 1 && pos % 8 !== 4 && board[pos - 3] === null) {
          possibleMoves = possibleMoves.concat({
            shortNotation: "".concat(pos, "-").concat(pos - 3),
            longNotation: "".concat(pos, "-").concat(pos - 3),
            capturedPieces: []
          });
        }
      } else {
        if (pos - 4 >= 1 && board[pos - 4] === null) {
          possibleMoves = possibleMoves.concat({
            shortNotation: "".concat(pos, "-").concat(pos - 4),
            longNotation: "".concat(pos, "-").concat(pos - 4),
            capturedPieces: []
          });
        }
        if (pos - 5 >= 1 && pos % 8 !== 5 && board[pos - 5] === null) {
          possibleMoves = possibleMoves.concat({
            shortNotation: "".concat(pos, "-").concat(pos - 5),
            longNotation: "".concat(pos, "-").concat(pos - 5),
            capturedPieces: []
          });
        }
      }
    }
    return possibleMoves;
  };
  var hasMoveByPos = function hasMoveByPos(pos) {
    return getPlayableMovesByPos(pos).length > 0;
  };
  var hasMoves = function hasMoves(player) {
    for (var pos = 1; pos <= 32; pos++) {
      if (board[pos] && board[pos].color === player && hasMoveByPos(pos)) {
        return true;
      }
    }
    return false;
  };
  var getPlayableJumpMoves = function getPlayableJumpMoves() {
    var jumpMoves = [];
    for (var pos = 1; pos <= 32; pos++) {
      if (board[pos] && board[pos].color === _this.turn) {
        var jumps = getJumpMovesByPos(pos);
        jumpMoves = jumpMoves.concat(jumps);
      }
    }
    return jumpMoves;
  };
  var getJumpMovesByPos = function getJumpMovesByPos(pos) {
    pos = parseInt(pos);
    if (pos < 1 || pos > 32) {
      return null;
    }
    var jumpMoves = [];
    if (board[pos] && board[pos].color === _this.turn) {
      var row = Math.floor((pos - 1) / 4);
      if (board[pos].color === CheckersGame.PLAYER_BLACK || board[pos].isKing) {
        if (row % 2 === 0) {
          if (pos + 9 <= 32 && pos % 4 !== 0 && board[pos + 9] === null && board[pos + 5] && board[pos + 5].color !== _this.turn) {
            jumpMoves.push({
              shortNotation: "".concat(pos, "x").concat(pos + 9),
              longNotation: "".concat(pos, "x").concat(pos + 9),
              capturedPieces: [pos + 5]
            });
          }
          if (pos + 7 <= 32 && pos % 4 !== 1 && board[pos + 7] === null && board[pos + 4] && board[pos + 4].color !== _this.turn) {
            jumpMoves.push({
              shortNotation: "".concat(pos, "x").concat(pos + 7),
              longNotation: "".concat(pos, "x").concat(pos + 7),
              capturedPieces: [pos + 4]
            });
          }
        } else {
          if (pos + 9 <= 32 && pos % 4 !== 0 && board[pos + 9] === null && board[pos + 4] && board[pos + 4].color !== _this.turn) {
            jumpMoves.push({
              shortNotation: "".concat(pos, "x").concat(pos + 9),
              longNotation: "".concat(pos, "x").concat(pos + 9),
              capturedPieces: [pos + 4]
            });
          }
          if (pos + 7 <= 32 && pos % 4 !== 1 && board[pos + 7] === null && board[pos + 3] && board[pos + 3].color !== _this.turn) {
            jumpMoves.push({
              shortNotation: "".concat(pos, "x").concat(pos + 7),
              longNotation: "".concat(pos, "x").concat(pos + 7),
              capturedPieces: [pos + 3]
            });
          }
        }
      }
      if (board[pos].color === CheckersGame.PLAYER_WHITE || board[pos].isKing) {
        if (row % 2 === 1) {
          if (pos - 9 >= 1 && pos % 4 !== 1 && board[pos - 9] === null && board[pos - 5] && board[pos - 5].color !== _this.turn) {
            jumpMoves.push({
              shortNotation: "".concat(pos, "x").concat(pos - 9),
              longNotation: "".concat(pos, "x").concat(pos - 9),
              capturedPieces: [pos - 5]
            });
          }
          if (pos - 7 >= 1 && pos % 4 !== 0 && board[pos - 7] === null && board[pos - 4] && board[pos - 4].color !== _this.turn) {
            jumpMoves.push({
              shortNotation: "".concat(pos, "x").concat(pos - 7),
              longNotation: "".concat(pos, "x").concat(pos - 7),
              capturedPieces: [pos - 4]
            });
          }
        } else {
          if (pos - 9 >= 1 && pos % 4 !== 1 && board[pos - 9] === null && board[pos - 4] && board[pos - 4].color !== _this.turn) {
            jumpMoves.push({
              shortNotation: "".concat(pos, "x").concat(pos - 9),
              longNotation: "".concat(pos, "x").concat(pos - 9),
              capturedPieces: [pos - 4]
            });
          }
          if (pos - 7 >= 1 && pos % 4 !== 0 && board[pos - 7] === null && board[pos - 3] && board[pos - 3].color !== _this.turn) {
            jumpMoves.push({
              shortNotation: "".concat(pos, "x").concat(pos - 7),
              longNotation: "".concat(pos, "x").concat(pos - 7),
              capturedPieces: [pos - 3]
            });
          }
        }
      }
    }
    var results = [];
    jumpMoves.forEach(function (jumpMove) {
      var capturedPiece = board[jumpMove.capturedPieces[0]];
      var _jumpMove$shortNotati = jumpMove.shortNotation.split('x'),
        _jumpMove$shortNotati2 = _slicedToArray(_jumpMove$shortNotati, 2),
        origin = _jumpMove$shortNotati2[0],
        dst = _jumpMove$shortNotati2[1];
      var jumpingPiece = board[origin];
      board[jumpMove.capturedPieces[0]] = null;
      board[dst] = jumpingPiece;
      board[origin] = null;
      var subJumps = getJumpMovesByPos(dst);
      board[dst] = null;
      board[origin] = jumpingPiece;
      board[jumpMove.capturedPieces[0]] = capturedPiece;
      if (subJumps.length > 0) {
        subJumps.forEach(function (subJump) {
          results.push({
            shortNotation: "".concat(origin, "x").concat(subJump.shortNotation.split('x').slice(-1)[0]),
            longNotation: "".concat(origin, "x").concat(subJump.longNotation),
            capturedPieces: jumpMove.capturedPieces.concat(subJump.capturedPieces)
          });
        });
      } else {
        results.push(jumpMove);
      }
    });
    return results;
  };
  this.getPlayableMovesByPosition = function (pos) {
    return getPlayableMovesByPos(pos);
  };
  this.getPlayableMoves = function () {
    var res = [];
    for (var _i2 = 1; _i2 <= 32; _i2++) {
      res = res.concat(getPlayableMovesByPos(_i2));
    }
    return res;
  };
  this.getPieceAtPosition = function (position) {
    return board[position];
  };
  this.doMove = function (origin, dst, longNotation) {
    if (!origin || !dst) {
      throw "Invalid move. Must specify origin square and destination square";
    }
    if (_this.getPieceAtPosition(origin) === null) {
      throw "Invalid move. Origin square is empty";
    }
    if (board[origin].color !== _this.turn) {
      throw "Invalid move. It is the other player's turn";
    }
    origin = parseInt(origin);
    dst = parseInt(dst);
    var candMove = [origin, dst];
    var validMoves = getPlayableMovesByPos(origin);
    var foundMoves = validMoves.filter(function (move) {
      var _move$shortNotation$s = move.shortNotation.split(/x|-/),
        _move$shortNotation$s2 = _slicedToArray(_move$shortNotation$s, 2),
        moveOrigin = _move$shortNotation$s2[0],
        moveDst = _move$shortNotation$s2[1];
      if (longNotation) {
        return longNotation == move.longNotation && moveOrigin == origin && moveDst == dst;
      } else {
        return moveOrigin == origin && moveDst == dst;
      }
    });
    if (foundMoves.length == 0) {
      throw "Invalid move. ".concat(candMove, " does not exist within ").concat(JSON.stringify(validMoves));
    }
    if (foundMoves.length > 1) {
      throw "Ambiguous move ".concat(candMove, ". Must provide long notation");
    }
    var foundMove = foundMoves[0];
    var lastAdvance = stateStack.length === 0 ? undefined : stateStack[stateStack.length - 1].lastAdvance;
    var lastCapture = stateStack.length === 0 ? undefined : stateStack[stateStack.length - 1].lastCapture;
    if (foundMove.capturedPieces.length > 0) {
      lastCapture = stateStack.length;
    } else if (!board[origin].isKing) {
      lastAdvance = stateStack.length;
    }
    stateStack.push({
      move: foundMove,
      fen: getFen(),
      lastCapture: lastCapture,
      lastAdvance: lastAdvance
    });
    var capturedPieces = foundMove.capturedPieces;
    if (dst !== origin) {
      board[dst] = board[origin];
      board[origin] = null;
    }
    capturedPieces.forEach(function (p) {
      return board[p] = null;
    });
    if (_this.turn === CheckersGame.PLAYER_BLACK) {
      if (dst >= 29 && dst <= 32 && !board[dst].isKing) {
        board[dst].isKing = true;
      }
    } else {
      if (dst >= 1 && dst <= 4 && !board[dst].isKing) {
        board[dst].isKing = true;
      }
    }
    _this.turn = _this.turn === CheckersGame.PLAYER_BLACK ? CheckersGame.PLAYER_WHITE : CheckersGame.PLAYER_BLACK;
  };
  this.isDraw = function () {
    var hasThreefold = stateStack.filter(function (s) {
      return s.fen === getFen();
    }).length === 2;
    if (hasThreefold) {
      return true;
    }
    if (stateStack.length > 0) {
      var _stateStack = stateStack[stateStack.length - 1],
        lastAdvance = _stateStack.lastAdvance,
        lastCapture = _stateStack.lastCapture;
      var movesSinceLastAdvance = Math.floor((stateStack.length - 1 - lastAdvance) / 2);
      var movesSinceLastCapture = Math.floor((stateStack.length - 1 - lastCapture) / 2);
      if (movesSinceLastAdvance >= 40 && movesSinceLastCapture >= 40) {
        return true;
      }
    }
    return false;
  };
  this.constructFromFen = function (fen) {
    for (var _i3 = 1; _i3 <= 32; _i3++) {
      board[_i3] = null;
    }
    var _fen$split = fen.split(':'),
      _fen$split2 = _slicedToArray(_fen$split, 3),
      turn = _fen$split2[0],
      p1Pieces = _fen$split2[1],
      p2Pieces = _fen$split2[2];
    turn = turn.toLowerCase();
    p1Pieces = p1Pieces.split(',');
    p1Pieces = p1Pieces.map(function (p) {
      return p.toLowerCase();
    }).map(function (p, i, arr) {
      return i == 0 ? p : arr[0].charAt(0) + p;
    });
    p2Pieces = p2Pieces.split(',');
    p2Pieces = p2Pieces.map(function (p) {
      return p.toLowerCase();
    }).map(function (p, i, arr) {
      return i == 0 ? p : arr[0].charAt(0) + p;
    });
    p1Pieces.concat(p2Pieces).forEach(function (piece) {
      var color = piece.charAt(0) == 'b' ? CheckersGame.PLAYER_BLACK : CheckersGame.PLAYER_WHITE;
      piece = piece.substring(1);
      var isKing = piece.charAt(0) == 'k';
      if (isKing) {
        piece = piece.substring(1);
      }
      var pos = parseInt(piece);
      if (pos === NaN) {
        throw 'Invalid FEN format';
      }
      board[pos] = new Piece(color);
      board[pos].isKing = isKing;
    });
    _this.turn = turn == 'b' ? CheckersGame.PLAYER_BLACK : CheckersGame.PLAYER_WHITE;
  };
  this.undoLastMove = function () {
    if (stateStack.length == 0) {
      throw 'No move to undo';
    }
    var newState = stateStack.pop();
    _this.constructFromFen(newState.fen);
  };
  this.getWinner = function () {
    if (_this.turn === CheckersGame.PLAYER_BLACK && !hasMoves(CheckersGame.PLAYER_BLACK)) {
      return CheckersGame.PLAYER_WHITE;
    }
    if (_this.turn === CheckersGame.PLAYER_WHITE && !hasMoves(CheckersGame.PLAYER_WHITE)) {
      return CheckersGame.PLAYER_BLACK;
    }
  };
  this.getFen = getFen;
  this.start = function () {
    _this.whitePieceCount = CheckersGame.STARTING_PIECE_COUNT_PER_PLAYER;
    _this.blackPieceCount = CheckersGame.STARTING_PIECE_COUNT_PER_PLAYER;
    _this.whitePiecesInStartingPosition = true;
    _this.blackPiecesInStartingPosition = true;
    _this.turn = CheckersGame.PLAYER_BLACK;
  };
});
_defineProperty(CheckersGame, "STARTING_PIECE_COUNT_PER_PLAYER", 12);
_defineProperty(CheckersGame, "NUM_PLAYERS", 2);
_defineProperty(CheckersGame, "PLAYER_WHITE", 'w');
_defineProperty(CheckersGame, "PLAYER_BLACK", 'b');
module.exports = CheckersGame;

},{"./Piece":4}],4:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var Piece = /*#__PURE__*/_createClass(function Piece(color) {
  _classCallCheck(this, Piece);
  this.color = color;
  this.isKing = false;
});
module.exports = Piece;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerChallengeHandlers = exports.emittedEvents = exports.challengeSocketHandlers = void 0;
var createEmittedEvents = function createEmittedEvents(socket) {
  return {
    respondToChallenge: function respondToChallenge(challengeId, accept) {
      return socket.emit('respondToChallenge', {
        challengeId: challengeId,
        accept: accept
      });
    }
  };
};
var emittedEvents = {};
exports.emittedEvents = emittedEvents;
var challengeSocketHandlers = {
  onChallengeStart: function onChallengeStart(_ref) {
    var gameId = _ref.gameId;
    window.location = "/play/game/".concat(gameId);
  },
  onChallengeRequest: function onChallengeRequest(_ref2) {
    var challenge = _ref2.challenge;
    var detail = "<p>".concat(challenge.senderName, " is challenging you</p>\n         <p>").concat(challenge.isRanked ? 'Ranked' : 'Unranked', "</p>\n         <p>You play ").concat(challenge.playerBlack === challenge.receiverName ? 'Black' : 'White', " pieces\n        ");
    var challengeDetail = document.createElement('p');
    challengeDetail.innerHTML = detail;
    var challengeDiv = document.createElement('div');
    challengeDiv.setAttribute('data-cy', 'challenge-request');
    var acceptChallenge = document.createElement('p');
    acceptChallenge.setAttribute('data-cy', 'challenge-accept');
    acceptChallenge.innerText = 'Accept';
    acceptChallenge.addEventListener('click', function (e) {
      emittedEvents.respondToChallenge(challenge._id, true);
    });
    var rejectChallenge = document.createElement('p');
    rejectChallenge.setAttribute('data-cy', 'challenge-reject');
    rejectChallenge.innerText = 'Reject';
    rejectChallenge.addEventListener('click', function (e) {
      emittedEvents.respondToChallenge(challenge._id, false);
      challengeDiv.remove();
    });
    challengeDiv.appendChild(challengeDetail);
    var respondDiv = document.createElement('div');
    respondDiv.classList.add('response-options');
    respondDiv.appendChild(acceptChallenge);
    respondDiv.appendChild(rejectChallenge);
    challengeDiv.appendChild(respondDiv);
    document.getElementById('notifications').appendChild(challengeDiv);
  },
  onChallengeRejected: function onChallengeRejected() {
    //alert('challengeRejected') 
  }
};
exports.challengeSocketHandlers = challengeSocketHandlers;
var registerChallengeHandlers = function registerChallengeHandlers(socket) {
  exports.emittedEvents = emittedEvents = createEmittedEvents(socket);
  socket.on('challengeStart', challengeSocketHandlers.onChallengeStart);
  socket.on('challengeRequest', challengeSocketHandlers.onChallengeRequest);
  socket.on('challengeRejected', challengeSocketHandlers.onChallengeRejected);
};
exports.registerChallengeHandlers = registerChallengeHandlers;

},{}],6:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var _challenge = require("../challenge");
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure " + obj); }
var CheckersBoard = require('../CheckersBoard');
var _require = require('../socket.io.js'),
  io = _require.io;
var options;
var toks = window.location.href.split('/');
var gameId = toks[toks.length - 1];
var playerColor;
var timeouts = [];
var vsCpu;
var socket = io.connect("/", {
  withCredentials: true
});
socket.on('connect', function () {
  emittedEvents.joinGame(gameId);
});
socket.on('disconnect', function (reason) {
  console.log("socket disconnected. reason: ".concat(reason));
});
var setInfoMessage = function setInfoMessage(text) {
  var messageDiv = document.getElementById('message');
  messageDiv.innerHTML = '';
  var msgText = document.createElement('p');
  msgText.innerHTML = text;
  messageDiv.appendChild(msgText);
  messageDiv.setAttribute('data-visible', '');
};
var clearMessage = function clearMessage() {
  document.getElementById('message').removeAttribute('data-visible');
};
var showDefaultButtons = function showDefaultButtons() {
  var buttonsDiv = document.getElementById('buttons');
  buttonsDiv.innerHTML = '';
  var resign = document.createElement('button');
  resign.textContent = 'Resign';
  resign.setAttribute('id', 'resign');
  resign.setAttribute('data-cy', 'resign');
  resign.classList.add('button');
  resign.onclick = function (e) {
    emittedEvents.resign(gameId);
  };
  var draw = document.createElement('button');
  draw.textContent = 'Offer draw';
  draw.setAttribute('id', 'offer-draw');
  draw.setAttribute('data-cy', 'offer-draw');
  draw.classList.add('button');
  draw.toggleAttribute('data-visible', !vsCpu);
  draw.onclick = function (e) {
    emittedEvents.offerDraw(gameId);
  };
  buttonsDiv.appendChild(resign);
  buttonsDiv.appendChild(draw);
};
var emittedEvents = {
  joinGame: function joinGame(id) {
    return socket.emit('joinGame', {
      id: id
    });
  },
  makeMove: function makeMove(move, id) {
    return socket.emit('makeMove', {
      move: move,
      id: id
    });
  },
  resign: function resign(id) {
    return socket.emit('resign', {
      id: id
    });
  },
  offerDraw: function offerDraw(id) {
    return socket.emit('offerDraw', {
      id: id
    });
  },
  respondDraw: function respondDraw(id, accept) {
    return socket.emit('respondDraw', {
      id: id,
      accept: accept
    });
  },
  claimWin: function claimWin(id) {
    return socket.emit('claimWin', {
      id: id
    });
  },
  callDraw: function callDraw(id) {
    return socket.emit('callDraw', {
      id: id
    });
  }
};
var socketHandlers = {
  onStartGame: function onStartGame(_ref) {
    var moveOptions = _ref.moveOptions,
      color = _ref.color;
    showDefaultButtons();
    playerColor = color;
    setInfoMessage("Game started. Black's turn");
    document.getElementById('board').remove();
    var newBoard = "<checkers-board id=\"board\" data-cy=\"board\" color=\"".concat(color, "\"></checkers-board>");
    var boardWrapper = document.querySelector('#board-wrapper');
    boardWrapper.innerHTML = newBoard;
    var board = document.getElementById('board');
    board.addEventListener("move", function (e) {
      var moveText = e.detail.moveText;
      var move = options.find(function (op) {
        return op.shortNotation === moveText || op.longNotation === moveText;
      });
      emittedEvents.makeMove(move, gameId);
    });
    options = moveOptions;
  },
  onMove: function onMove(_ref2) {
    var moveOptions = _ref2.moveOptions,
      fen = _ref2.fen,
      completedMoves = _ref2.completedMoves;
    clearMessage();
    showDefaultButtons();
    var board = document.querySelector('#board');
    board.lastMove = completedMoves[completedMoves.length - 1].shortNotation.split(/x|-/);
    board.setBoardFromFen(fen);
    options = moveOptions;
  },
  onGameOver: function onGameOver(_ref3) {
    var gameId = _ref3.gameId,
      result = _ref3.result,
      reason = _ref3.reason;
    if (result === 'd') {
      result = "Draw.";
    } else {
      result = result === 'b' ? "Black wins." : "White wins.";
    }
    document.getElementById('board').lockBoard();
    setInfoMessage("".concat(reason ? reason + "." : '', " ").concat(result));
    var buttonContainer = document.getElementById('buttons');
    buttonContainer.innerHTML = '';
    var analyzeButton = document.createElement('button');
    analyzeButton.setAttribute('id', 'analyze');
    analyzeButton.setAttribute('data-cy', 'analyze');
    analyzeButton.classList.add('button');
    analyzeButton.addEventListener('click', function (e) {
      window.location = "/analyze?g=".concat(gameId);
    });
    analyzeButton.textContent = 'Analyze';
    buttonContainer.appendChild(analyzeButton);
  },
  onOfferDraw: function onOfferDraw(_ref4) {
    var id = _ref4.id,
      color = _ref4.color;
    if (color === playerColor) {
      setInfoMessage("".concat(color === 'b' ? 'Black' : 'White', " offered draw."));
      return;
    }
    setInfoMessage("Opponent is offering draw. Accept?");
    var acceptDraw = document.createElement('button');
    acceptDraw.setAttribute('id', 'accept-draw');
    acceptDraw.setAttribute('data-cy', 'accept-draw');
    acceptDraw.classList.add('button');
    acceptDraw.innerText = 'accept';
    acceptDraw.onclick = function (e) {
      emittedEvents.respondDraw(gameId, true);
      showDefaultButtons();
    };
    var declineDraw = document.createElement('button');
    declineDraw.setAttribute('id', 'decline-draw');
    declineDraw.setAttribute('data-cy', 'decline-draw');
    declineDraw.classList.add('button');
    declineDraw.innerText = 'decline';
    declineDraw.onclick = function (e) {
      emittedEvents.respondDraw(gameId, false);
      showDefaultButtons();
    };
    var buttonsDiv = document.getElementById('buttons');
    buttonsDiv.innerHTML = '';
    buttonsDiv.appendChild(acceptDraw);
    buttonsDiv.appendChild(declineDraw);
  },
  onDrawDeclined: function onDrawDeclined(_ref5) {
    var id = _ref5.id,
      color = _ref5.color;
    var player = color === 'b' ? 'Black' : 'White';
    setInfoMessage("".concat(player, " declined draw offer"));
    showDefaultButtons();
  },
  onPlayerDisconnect: function onPlayerDisconnect(_ref6) {
    _objectDestructuringEmpty(_ref6);
    var board = document.getElementById('board');
    if (board.isLocked) {
      return;
    }
    timeouts = [];
    var _loop = function _loop(i) {
      timeouts.push(setTimeout(function () {
        return setInfoMessage("Opponent left the game. You can claim a win in ".concat(10 - i, " seconds..."));
      }, 1000 * i));
    };
    for (var i = 0; i < 10; i++) {
      _loop(i);
    }
    timeouts.push(setTimeout(function () {
      setInfoMessage('Opponent left the game.');
      var claimWin = document.createElement('button');
      claimWin.setAttribute('id', 'claim-win');
      claimWin.setAttribute('data-cy', 'claim-win');
      claimWin.classList.add('button');
      claimWin.innerText = 'claim win';
      claimWin.onclick = function (e) {
        emittedEvents.claimWin(gameId);
        showDefaultButtons();
      };
      var callDraw = document.createElement('button');
      callDraw.setAttribute('id', 'call-draw');
      callDraw.setAttribute('data-cy', 'call-draw');
      callDraw.classList.add('button');
      callDraw.innerText = 'call draw';
      callDraw.onclick = function (e) {
        emittedEvents.callDraw(gameId);
        showDefaultButtons();
      };
      var buttonsDiv = document.getElementById('buttons');
      buttonsDiv.innerHTML = '';
      buttonsDiv.appendChild(claimWin);
      buttonsDiv.appendChild(callDraw);
    }, 10000));
  },
  onPlayerReconnect: function onPlayerReconnect(_ref7) {
    var moveOptions = _ref7.moveOptions,
      fen = _ref7.fen,
      color = _ref7.color;
    showDefaultButtons();
    clearMessage();
    timeouts.forEach(function (to) {
      return clearTimeout(to);
    });
    if (document.getElementById('board').getAttribute('color') === '') {
      document.getElementById('board').remove();
      var newBoard = "<checkers-board id=\"board\" data-cy=\"board\" color=\"".concat(color, "\"></checkers-board>");
      var boardWrapper = document.getElementById('board-wrapper');
      boardWrapper.innerHTML = newBoard;
      var board = document.getElementById('board');
      board.addEventListener("move", function (e) {
        var moveText = e.detail.moveText;
        var move = options.find(function (op) {
          return op.shortNotation === moveText || op.longNotation === moveText;
        });
        emittedEvents.makeMove(move, gameId);
      });
      var resignButton = document.getElementById('resign');
      resignButton.onclick = function (e) {
        emittedEvents.resign(gameId);
      };
      var drawButton = document.getElementById('offer-draw');
      drawButton.onclick = function (e) {
        emittedEvents.offerDraw(gameId);
      };
      options = moveOptions;
      board.setBoardFromFen(fen);
    }
  }
};
if (window.Cypress) {
  window.socketHandlers = socketHandlers;
  window.challengeSocketHandlers = _challenge.challengeSocketHandlers;
  window.emittedEvents = emittedEvents;
}
(0, _challenge.registerChallengeHandlers)(socket);
socket.on('startGame', socketHandlers.onStartGame);
socket.on('move', socketHandlers.onMove);
socket.on('gameOver', socketHandlers.onGameOver);
socket.on('offerDraw', socketHandlers.onOfferDraw);
socket.on('drawDeclined', socketHandlers.onDrawDeclined);
socket.on('playerDisconnect', socketHandlers.onPlayerDisconnect);
socket.on('playerReconnect', socketHandlers.onPlayerReconnect);
window.addEventListener('load', /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(e) {
    var mobileNavToggle, nav, game, body, drawButton;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          mobileNavToggle = document.querySelector('.mobile-nav-toggle');
          nav = document.querySelector('nav');
          mobileNavToggle.addEventListener('click', function () {
            nav.toggleAttribute('data-visible');
            mobileNavToggle.setAttribute('aria-expanded', nav.hasAttribute('data-visible'));
          });
          if (window.Cypress) {
            window.gameId = gameId;
          }
          setInfoMessage('Waiting for players');
          if (window.Cypress) {
            _context.next = 19;
            break;
          }
          _context.next = 8;
          return fetch("/api/game/".concat(gameId), {
            method: 'GET'
          });
        case 8:
          game = _context.sent;
          if (!game) {
            _context.next = 19;
            break;
          }
          _context.next = 12;
          return game.json();
        case 12:
          body = _context.sent;
          if (!(body.gameState === 'completed')) {
            _context.next = 16;
            break;
          }
          window.location = "/analyze?g=".concat(gameId);
          return _context.abrupt("return");
        case 16:
          vsCpu = body.vsCpu;
          drawButton = document.getElementById('offer-draw');
          if (drawButton) {
            drawButton.toggleAttribute('data-visible', !vsCpu);
          }
        case 19:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function (_x) {
    return _ref8.apply(this, arguments);
  };
}());

},{"../CheckersBoard":2,"../challenge":5,"../socket.io.js":7}],7:[function(require,module,exports){
"use strict";

function _typeof2(obj) { "@babel/helpers - typeof"; return _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof2(obj); }
/*!
 * Socket.IO v4.5.4
 * (c) 2014-2022 Guillermo Rauch
 * Released under the MIT License.
 */
(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof2(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.io = factory());
})(void 0, function () {
  'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    Object.defineProperty(subClass, "prototype", {
      writable: false
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }
  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
    return _setPrototypeOf(o, p);
  }
  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }
  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct.bind();
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }
    return _construct.apply(null, arguments);
  }
  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }
  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;
    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;
      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }
      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);
        _cache.set(Class, Wrapper);
      }
      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }
      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };
    return _wrapNativeSuper(Class);
  }
  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
  }
  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof2(call) === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }
    return _assertThisInitialized(self);
  }
  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
        result;
      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }
      return _possibleConstructorReturn(this, result);
    };
  }
  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }
    return object;
  }
  function _get() {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get.bind();
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);
        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);
        if (desc.get) {
          return desc.get.call(arguments.length < 3 ? target : receiver);
        }
        return desc.value;
      };
    }
    return _get.apply(this, arguments);
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;
        var F = function F() {};
        return {
          s: F,
          n: function n() {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function e(_e) {
            throw _e;
          },
          f: F
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true,
      didErr = false,
      err;
    return {
      s: function s() {
        it = it.call(o);
      },
      n: function n() {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function e(_e2) {
        didErr = true;
        err = _e2;
      },
      f: function f() {
        try {
          if (!normalCompletion && it["return"] != null) it["return"]();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }
  var PACKET_TYPES = Object.create(null); // no Map = no polyfill

  PACKET_TYPES["open"] = "0";
  PACKET_TYPES["close"] = "1";
  PACKET_TYPES["ping"] = "2";
  PACKET_TYPES["pong"] = "3";
  PACKET_TYPES["message"] = "4";
  PACKET_TYPES["upgrade"] = "5";
  PACKET_TYPES["noop"] = "6";
  var PACKET_TYPES_REVERSE = Object.create(null);
  Object.keys(PACKET_TYPES).forEach(function (key) {
    PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
  });
  var ERROR_PACKET = {
    type: "error",
    data: "parser error"
  };
  var withNativeBlob$1 = typeof Blob === "function" || typeof Blob !== "undefined" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]";
  var withNativeArrayBuffer$2 = typeof ArrayBuffer === "function"; // ArrayBuffer.isView method is not defined in IE10

  var isView$1 = function isView(obj) {
    return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj && obj.buffer instanceof ArrayBuffer;
  };
  var encodePacket = function encodePacket(_ref, supportsBinary, callback) {
    var type = _ref.type,
      data = _ref.data;
    if (withNativeBlob$1 && data instanceof Blob) {
      if (supportsBinary) {
        return callback(data);
      } else {
        return encodeBlobAsBase64(data, callback);
      }
    } else if (withNativeArrayBuffer$2 && (data instanceof ArrayBuffer || isView$1(data))) {
      if (supportsBinary) {
        return callback(data);
      } else {
        return encodeBlobAsBase64(new Blob([data]), callback);
      }
    } // plain string

    return callback(PACKET_TYPES[type] + (data || ""));
  };
  var encodeBlobAsBase64 = function encodeBlobAsBase64(data, callback) {
    var fileReader = new FileReader();
    fileReader.onload = function () {
      var content = fileReader.result.split(",")[1];
      callback("b" + content);
    };
    return fileReader.readAsDataURL(data);
  };
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'; // Use a lookup table to find the index.

  var lookup$1 = typeof Uint8Array === 'undefined' ? [] : new Uint8Array(256);
  for (var i$1 = 0; i$1 < chars.length; i$1++) {
    lookup$1[chars.charCodeAt(i$1)] = i$1;
  }
  var decode$1 = function decode(base64) {
    var bufferLength = base64.length * 0.75,
      len = base64.length,
      i,
      p = 0,
      encoded1,
      encoded2,
      encoded3,
      encoded4;
    if (base64[base64.length - 1] === '=') {
      bufferLength--;
      if (base64[base64.length - 2] === '=') {
        bufferLength--;
      }
    }
    var arraybuffer = new ArrayBuffer(bufferLength),
      bytes = new Uint8Array(arraybuffer);
    for (i = 0; i < len; i += 4) {
      encoded1 = lookup$1[base64.charCodeAt(i)];
      encoded2 = lookup$1[base64.charCodeAt(i + 1)];
      encoded3 = lookup$1[base64.charCodeAt(i + 2)];
      encoded4 = lookup$1[base64.charCodeAt(i + 3)];
      bytes[p++] = encoded1 << 2 | encoded2 >> 4;
      bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
      bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
    }
    return arraybuffer;
  };
  var withNativeArrayBuffer$1 = typeof ArrayBuffer === "function";
  var decodePacket = function decodePacket(encodedPacket, binaryType) {
    if (typeof encodedPacket !== "string") {
      return {
        type: "message",
        data: mapBinary(encodedPacket, binaryType)
      };
    }
    var type = encodedPacket.charAt(0);
    if (type === "b") {
      return {
        type: "message",
        data: decodeBase64Packet(encodedPacket.substring(1), binaryType)
      };
    }
    var packetType = PACKET_TYPES_REVERSE[type];
    if (!packetType) {
      return ERROR_PACKET;
    }
    return encodedPacket.length > 1 ? {
      type: PACKET_TYPES_REVERSE[type],
      data: encodedPacket.substring(1)
    } : {
      type: PACKET_TYPES_REVERSE[type]
    };
  };
  var decodeBase64Packet = function decodeBase64Packet(data, binaryType) {
    if (withNativeArrayBuffer$1) {
      var decoded = decode$1(data);
      return mapBinary(decoded, binaryType);
    } else {
      return {
        base64: true,
        data: data
      }; // fallback for old browsers
    }
  };

  var mapBinary = function mapBinary(data, binaryType) {
    switch (binaryType) {
      case "blob":
        return data instanceof ArrayBuffer ? new Blob([data]) : data;
      case "arraybuffer":
      default:
        return data;
      // assuming the data is already an ArrayBuffer
    }
  };

  var SEPARATOR = String.fromCharCode(30); // see https://en.wikipedia.org/wiki/Delimiter#ASCII_delimited_text

  var encodePayload = function encodePayload(packets, callback) {
    // some packets may be added to the array while encoding, so the initial length must be saved
    var length = packets.length;
    var encodedPackets = new Array(length);
    var count = 0;
    packets.forEach(function (packet, i) {
      // force base64 encoding for binary packets
      encodePacket(packet, false, function (encodedPacket) {
        encodedPackets[i] = encodedPacket;
        if (++count === length) {
          callback(encodedPackets.join(SEPARATOR));
        }
      });
    });
  };
  var decodePayload = function decodePayload(encodedPayload, binaryType) {
    var encodedPackets = encodedPayload.split(SEPARATOR);
    var packets = [];
    for (var i = 0; i < encodedPackets.length; i++) {
      var decodedPacket = decodePacket(encodedPackets[i], binaryType);
      packets.push(decodedPacket);
      if (decodedPacket.type === "error") {
        break;
      }
    }
    return packets;
  };
  var protocol$1 = 4;

  /**
   * Initialize a new `Emitter`.
   *
   * @api public
   */
  function Emitter(obj) {
    if (obj) return mixin(obj);
  }
  /**
   * Mixin the emitter properties.
   *
   * @param {Object} obj
   * @return {Object}
   * @api private
   */

  function mixin(obj) {
    for (var key in Emitter.prototype) {
      obj[key] = Emitter.prototype[key];
    }
    return obj;
  }
  /**
   * Listen on the given `event` with `fn`.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */

  Emitter.prototype.on = Emitter.prototype.addEventListener = function (event, fn) {
    this._callbacks = this._callbacks || {};
    (this._callbacks['$' + event] = this._callbacks['$' + event] || []).push(fn);
    return this;
  };
  /**
   * Adds an `event` listener that will be invoked a single
   * time then automatically removed.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */

  Emitter.prototype.once = function (event, fn) {
    function on() {
      this.off(event, on);
      fn.apply(this, arguments);
    }
    on.fn = fn;
    this.on(event, on);
    return this;
  };
  /**
   * Remove the given callback for `event` or all
   * registered callbacks.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */

  Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function (event, fn) {
    this._callbacks = this._callbacks || {}; // all

    if (0 == arguments.length) {
      this._callbacks = {};
      return this;
    } // specific event

    var callbacks = this._callbacks['$' + event];
    if (!callbacks) return this; // remove all handlers

    if (1 == arguments.length) {
      delete this._callbacks['$' + event];
      return this;
    } // remove specific handler

    var cb;
    for (var i = 0; i < callbacks.length; i++) {
      cb = callbacks[i];
      if (cb === fn || cb.fn === fn) {
        callbacks.splice(i, 1);
        break;
      }
    } // Remove event specific arrays for event types that no
    // one is subscribed for to avoid memory leak.

    if (callbacks.length === 0) {
      delete this._callbacks['$' + event];
    }
    return this;
  };
  /**
   * Emit `event` with the given args.
   *
   * @param {String} event
   * @param {Mixed} ...
   * @return {Emitter}
   */

  Emitter.prototype.emit = function (event) {
    this._callbacks = this._callbacks || {};
    var args = new Array(arguments.length - 1),
      callbacks = this._callbacks['$' + event];
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
    if (callbacks) {
      callbacks = callbacks.slice(0);
      for (var i = 0, len = callbacks.length; i < len; ++i) {
        callbacks[i].apply(this, args);
      }
    }
    return this;
  }; // alias used for reserved events (protected method)

  Emitter.prototype.emitReserved = Emitter.prototype.emit;
  /**
   * Return array of callbacks for `event`.
   *
   * @param {String} event
   * @return {Array}
   * @api public
   */

  Emitter.prototype.listeners = function (event) {
    this._callbacks = this._callbacks || {};
    return this._callbacks['$' + event] || [];
  };
  /**
   * Check if this emitter has `event` handlers.
   *
   * @param {String} event
   * @return {Boolean}
   * @api public
   */

  Emitter.prototype.hasListeners = function (event) {
    return !!this.listeners(event).length;
  };
  var globalThisShim = function () {
    if (typeof self !== "undefined") {
      return self;
    } else if (typeof window !== "undefined") {
      return window;
    } else {
      return Function("return this")();
    }
  }();
  function pick(obj) {
    for (var _len = arguments.length, attr = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      attr[_key - 1] = arguments[_key];
    }
    return attr.reduce(function (acc, k) {
      if (obj.hasOwnProperty(k)) {
        acc[k] = obj[k];
      }
      return acc;
    }, {});
  } // Keep a reference to the real timeout functions so they can be used when overridden

  var NATIVE_SET_TIMEOUT = setTimeout;
  var NATIVE_CLEAR_TIMEOUT = clearTimeout;
  function installTimerFunctions(obj, opts) {
    if (opts.useNativeTimers) {
      obj.setTimeoutFn = NATIVE_SET_TIMEOUT.bind(globalThisShim);
      obj.clearTimeoutFn = NATIVE_CLEAR_TIMEOUT.bind(globalThisShim);
    } else {
      obj.setTimeoutFn = setTimeout.bind(globalThisShim);
      obj.clearTimeoutFn = clearTimeout.bind(globalThisShim);
    }
  } // base64 encoded buffers are about 33% bigger (https://en.wikipedia.org/wiki/Base64)

  var BASE64_OVERHEAD = 1.33; // we could also have used `new Blob([obj]).size`, but it isn't supported in IE9

  function byteLength(obj) {
    if (typeof obj === "string") {
      return utf8Length(obj);
    } // arraybuffer or blob

    return Math.ceil((obj.byteLength || obj.size) * BASE64_OVERHEAD);
  }
  function utf8Length(str) {
    var c = 0,
      length = 0;
    for (var i = 0, l = str.length; i < l; i++) {
      c = str.charCodeAt(i);
      if (c < 0x80) {
        length += 1;
      } else if (c < 0x800) {
        length += 2;
      } else if (c < 0xd800 || c >= 0xe000) {
        length += 3;
      } else {
        i++;
        length += 4;
      }
    }
    return length;
  }
  var TransportError = /*#__PURE__*/function (_Error) {
    _inherits(TransportError, _Error);
    var _super = _createSuper(TransportError);
    function TransportError(reason, description, context) {
      var _this;
      _classCallCheck(this, TransportError);
      _this = _super.call(this, reason);
      _this.description = description;
      _this.context = context;
      _this.type = "TransportError";
      return _this;
    }
    return _createClass(TransportError);
  }( /*#__PURE__*/_wrapNativeSuper(Error));
  var Transport = /*#__PURE__*/function (_Emitter) {
    _inherits(Transport, _Emitter);
    var _super2 = _createSuper(Transport);

    /**
     * Transport abstract constructor.
     *
     * @param {Object} options.
     * @api private
     */
    function Transport(opts) {
      var _this2;
      _classCallCheck(this, Transport);
      _this2 = _super2.call(this);
      _this2.writable = false;
      installTimerFunctions(_assertThisInitialized(_this2), opts);
      _this2.opts = opts;
      _this2.query = opts.query;
      _this2.readyState = "";
      _this2.socket = opts.socket;
      return _this2;
    }
    /**
     * Emits an error.
     *
     * @param {String} reason
     * @param description
     * @param context - the error context
     * @return {Transport} for chaining
     * @api protected
     */

    _createClass(Transport, [{
      key: "onError",
      value: function onError(reason, description, context) {
        _get(_getPrototypeOf(Transport.prototype), "emitReserved", this).call(this, "error", new TransportError(reason, description, context));
        return this;
      }
      /**
       * Opens the transport.
       *
       * @api public
       */
    }, {
      key: "open",
      value: function open() {
        if ("closed" === this.readyState || "" === this.readyState) {
          this.readyState = "opening";
          this.doOpen();
        }
        return this;
      }
      /**
       * Closes the transport.
       *
       * @api public
       */
    }, {
      key: "close",
      value: function close() {
        if ("opening" === this.readyState || "open" === this.readyState) {
          this.doClose();
          this.onClose();
        }
        return this;
      }
      /**
       * Sends multiple packets.
       *
       * @param {Array} packets
       * @api public
       */
    }, {
      key: "send",
      value: function send(packets) {
        if ("open" === this.readyState) {
          this.write(packets);
        }
      }
      /**
       * Called upon open
       *
       * @api protected
       */
    }, {
      key: "onOpen",
      value: function onOpen() {
        this.readyState = "open";
        this.writable = true;
        _get(_getPrototypeOf(Transport.prototype), "emitReserved", this).call(this, "open");
      }
      /**
       * Called with data.
       *
       * @param {String} data
       * @api protected
       */
    }, {
      key: "onData",
      value: function onData(data) {
        var packet = decodePacket(data, this.socket.binaryType);
        this.onPacket(packet);
      }
      /**
       * Called with a decoded packet.
       *
       * @api protected
       */
    }, {
      key: "onPacket",
      value: function onPacket(packet) {
        _get(_getPrototypeOf(Transport.prototype), "emitReserved", this).call(this, "packet", packet);
      }
      /**
       * Called upon close.
       *
       * @api protected
       */
    }, {
      key: "onClose",
      value: function onClose(details) {
        this.readyState = "closed";
        _get(_getPrototypeOf(Transport.prototype), "emitReserved", this).call(this, "close", details);
      }
    }]);
    return Transport;
  }(Emitter);

  // imported from https://github.com/unshiftio/yeast

  var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split(''),
    length = 64,
    map = {};
  var seed = 0,
    i = 0,
    prev;
  /**
   * Return a string representing the specified number.
   *
   * @param {Number} num The number to convert.
   * @returns {String} The string representation of the number.
   * @api public
   */

  function encode$1(num) {
    var encoded = '';
    do {
      encoded = alphabet[num % length] + encoded;
      num = Math.floor(num / length);
    } while (num > 0);
    return encoded;
  }
  /**
   * Yeast: A tiny growing id generator.
   *
   * @returns {String} A unique id.
   * @api public
   */

  function yeast() {
    var now = encode$1(+new Date());
    if (now !== prev) return seed = 0, prev = now;
    return now + '.' + encode$1(seed++);
  } //
  // Map each character to its index.
  //

  for (; i < length; i++) {
    map[alphabet[i]] = i;
  }

  // imported from https://github.com/galkn/querystring

  /**
   * Compiles a querystring
   * Returns string representation of the object
   *
   * @param {Object}
   * @api private
   */
  function encode(obj) {
    var str = '';
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        if (str.length) str += '&';
        str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
      }
    }
    return str;
  }
  /**
   * Parses a simple querystring into an object
   *
   * @param {String} qs
   * @api private
   */

  function decode(qs) {
    var qry = {};
    var pairs = qs.split('&');
    for (var i = 0, l = pairs.length; i < l; i++) {
      var pair = pairs[i].split('=');
      qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    return qry;
  }

  // imported from https://github.com/component/has-cors
  var value = false;
  try {
    value = typeof XMLHttpRequest !== 'undefined' && 'withCredentials' in new XMLHttpRequest();
  } catch (err) {// if XMLHttp support is disabled in IE then it will throw
    // when trying to create
  }
  var hasCORS = value;

  // browser shim for xmlhttprequest module
  function XHR(opts) {
    var xdomain = opts.xdomain; // XMLHttpRequest can be disabled on IE

    try {
      if ("undefined" !== typeof XMLHttpRequest && (!xdomain || hasCORS)) {
        return new XMLHttpRequest();
      }
    } catch (e) {}
    if (!xdomain) {
      try {
        return new globalThisShim[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
      } catch (e) {}
    }
  }
  function empty() {}
  var hasXHR2 = function () {
    var xhr = new XHR({
      xdomain: false
    });
    return null != xhr.responseType;
  }();
  var Polling = /*#__PURE__*/function (_Transport) {
    _inherits(Polling, _Transport);
    var _super = _createSuper(Polling);

    /**
     * XHR Polling constructor.
     *
     * @param {Object} opts
     * @api public
     */
    function Polling(opts) {
      var _this;
      _classCallCheck(this, Polling);
      _this = _super.call(this, opts);
      _this.polling = false;
      if (typeof location !== "undefined") {
        var isSSL = "https:" === location.protocol;
        var port = location.port; // some user agents have empty `location.port`

        if (!port) {
          port = isSSL ? "443" : "80";
        }
        _this.xd = typeof location !== "undefined" && opts.hostname !== location.hostname || port !== opts.port;
        _this.xs = opts.secure !== isSSL;
      }
      /**
       * XHR supports binary
       */

      var forceBase64 = opts && opts.forceBase64;
      _this.supportsBinary = hasXHR2 && !forceBase64;
      return _this;
    }
    /**
     * Transport name.
     */

    _createClass(Polling, [{
      key: "name",
      get: function get() {
        return "polling";
      }
      /**
       * Opens the socket (triggers polling). We write a PING message to determine
       * when the transport is open.
       *
       * @api private
       */
    }, {
      key: "doOpen",
      value: function doOpen() {
        this.poll();
      }
      /**
       * Pauses polling.
       *
       * @param {Function} callback upon buffers are flushed and transport is paused
       * @api private
       */
    }, {
      key: "pause",
      value: function pause(onPause) {
        var _this2 = this;
        this.readyState = "pausing";
        var pause = function pause() {
          _this2.readyState = "paused";
          onPause();
        };
        if (this.polling || !this.writable) {
          var total = 0;
          if (this.polling) {
            total++;
            this.once("pollComplete", function () {
              --total || pause();
            });
          }
          if (!this.writable) {
            total++;
            this.once("drain", function () {
              --total || pause();
            });
          }
        } else {
          pause();
        }
      }
      /**
       * Starts polling cycle.
       *
       * @api public
       */
    }, {
      key: "poll",
      value: function poll() {
        this.polling = true;
        this.doPoll();
        this.emitReserved("poll");
      }
      /**
       * Overloads onData to detect payloads.
       *
       * @api private
       */
    }, {
      key: "onData",
      value: function onData(data) {
        var _this3 = this;
        var callback = function callback(packet) {
          // if its the first message we consider the transport open
          if ("opening" === _this3.readyState && packet.type === "open") {
            _this3.onOpen();
          } // if its a close packet, we close the ongoing requests

          if ("close" === packet.type) {
            _this3.onClose({
              description: "transport closed by the server"
            });
            return false;
          } // otherwise bypass onData and handle the message

          _this3.onPacket(packet);
        }; // decode payload

        decodePayload(data, this.socket.binaryType).forEach(callback); // if an event did not trigger closing

        if ("closed" !== this.readyState) {
          // if we got data we're not polling
          this.polling = false;
          this.emitReserved("pollComplete");
          if ("open" === this.readyState) {
            this.poll();
          }
        }
      }
      /**
       * For polling, send a close packet.
       *
       * @api private
       */
    }, {
      key: "doClose",
      value: function doClose() {
        var _this4 = this;
        var close = function close() {
          _this4.write([{
            type: "close"
          }]);
        };
        if ("open" === this.readyState) {
          close();
        } else {
          // in case we're trying to close while
          // handshaking is in progress (GH-164)
          this.once("open", close);
        }
      }
      /**
       * Writes a packets payload.
       *
       * @param {Array} data packets
       * @param {Function} drain callback
       * @api private
       */
    }, {
      key: "write",
      value: function write(packets) {
        var _this5 = this;
        this.writable = false;
        encodePayload(packets, function (data) {
          _this5.doWrite(data, function () {
            _this5.writable = true;
            _this5.emitReserved("drain");
          });
        });
      }
      /**
       * Generates uri for connection.
       *
       * @api private
       */
    }, {
      key: "uri",
      value: function uri() {
        var query = this.query || {};
        var schema = this.opts.secure ? "https" : "http";
        var port = ""; // cache busting is forced

        if (false !== this.opts.timestampRequests) {
          query[this.opts.timestampParam] = yeast();
        }
        if (!this.supportsBinary && !query.sid) {
          query.b64 = 1;
        } // avoid port if default for schema

        if (this.opts.port && ("https" === schema && Number(this.opts.port) !== 443 || "http" === schema && Number(this.opts.port) !== 80)) {
          port = ":" + this.opts.port;
        }
        var encodedQuery = encode(query);
        var ipv6 = this.opts.hostname.indexOf(":") !== -1;
        return schema + "://" + (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) + port + this.opts.path + (encodedQuery.length ? "?" + encodedQuery : "");
      }
      /**
       * Creates a request.
       *
       * @param {String} method
       * @api private
       */
    }, {
      key: "request",
      value: function request() {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        _extends(opts, {
          xd: this.xd,
          xs: this.xs
        }, this.opts);
        return new Request(this.uri(), opts);
      }
      /**
       * Sends data.
       *
       * @param {String} data to send.
       * @param {Function} called upon flush.
       * @api private
       */
    }, {
      key: "doWrite",
      value: function doWrite(data, fn) {
        var _this6 = this;
        var req = this.request({
          method: "POST",
          data: data
        });
        req.on("success", fn);
        req.on("error", function (xhrStatus, context) {
          _this6.onError("xhr post error", xhrStatus, context);
        });
      }
      /**
       * Starts a poll cycle.
       *
       * @api private
       */
    }, {
      key: "doPoll",
      value: function doPoll() {
        var _this7 = this;
        var req = this.request();
        req.on("data", this.onData.bind(this));
        req.on("error", function (xhrStatus, context) {
          _this7.onError("xhr poll error", xhrStatus, context);
        });
        this.pollXhr = req;
      }
    }]);
    return Polling;
  }(Transport);
  var Request = /*#__PURE__*/function (_Emitter) {
    _inherits(Request, _Emitter);
    var _super2 = _createSuper(Request);

    /**
     * Request constructor
     *
     * @param {Object} options
     * @api public
     */
    function Request(uri, opts) {
      var _this8;
      _classCallCheck(this, Request);
      _this8 = _super2.call(this);
      installTimerFunctions(_assertThisInitialized(_this8), opts);
      _this8.opts = opts;
      _this8.method = opts.method || "GET";
      _this8.uri = uri;
      _this8.async = false !== opts.async;
      _this8.data = undefined !== opts.data ? opts.data : null;
      _this8.create();
      return _this8;
    }
    /**
     * Creates the XHR object and sends the request.
     *
     * @api private
     */

    _createClass(Request, [{
      key: "create",
      value: function create() {
        var _this9 = this;
        var opts = pick(this.opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
        opts.xdomain = !!this.opts.xd;
        opts.xscheme = !!this.opts.xs;
        var xhr = this.xhr = new XHR(opts);
        try {
          xhr.open(this.method, this.uri, this.async);
          try {
            if (this.opts.extraHeaders) {
              xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
              for (var i in this.opts.extraHeaders) {
                if (this.opts.extraHeaders.hasOwnProperty(i)) {
                  xhr.setRequestHeader(i, this.opts.extraHeaders[i]);
                }
              }
            }
          } catch (e) {}
          if ("POST" === this.method) {
            try {
              xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
            } catch (e) {}
          }
          try {
            xhr.setRequestHeader("Accept", "*/*");
          } catch (e) {} // ie6 check

          if ("withCredentials" in xhr) {
            xhr.withCredentials = this.opts.withCredentials;
          }
          if (this.opts.requestTimeout) {
            xhr.timeout = this.opts.requestTimeout;
          }
          xhr.onreadystatechange = function () {
            if (4 !== xhr.readyState) return;
            if (200 === xhr.status || 1223 === xhr.status) {
              _this9.onLoad();
            } else {
              // make sure the `error` event handler that's user-set
              // does not throw in the same tick and gets caught here
              _this9.setTimeoutFn(function () {
                _this9.onError(typeof xhr.status === "number" ? xhr.status : 0);
              }, 0);
            }
          };
          xhr.send(this.data);
        } catch (e) {
          // Need to defer since .create() is called directly from the constructor
          // and thus the 'error' event can only be only bound *after* this exception
          // occurs.  Therefore, also, we cannot throw here at all.
          this.setTimeoutFn(function () {
            _this9.onError(e);
          }, 0);
          return;
        }
        if (typeof document !== "undefined") {
          this.index = Request.requestsCount++;
          Request.requests[this.index] = this;
        }
      }
      /**
       * Called upon error.
       *
       * @api private
       */
    }, {
      key: "onError",
      value: function onError(err) {
        this.emitReserved("error", err, this.xhr);
        this.cleanup(true);
      }
      /**
       * Cleans up house.
       *
       * @api private
       */
    }, {
      key: "cleanup",
      value: function cleanup(fromError) {
        if ("undefined" === typeof this.xhr || null === this.xhr) {
          return;
        }
        this.xhr.onreadystatechange = empty;
        if (fromError) {
          try {
            this.xhr.abort();
          } catch (e) {}
        }
        if (typeof document !== "undefined") {
          delete Request.requests[this.index];
        }
        this.xhr = null;
      }
      /**
       * Called upon load.
       *
       * @api private
       */
    }, {
      key: "onLoad",
      value: function onLoad() {
        var data = this.xhr.responseText;
        if (data !== null) {
          this.emitReserved("data", data);
          this.emitReserved("success");
          this.cleanup();
        }
      }
      /**
       * Aborts the request.
       *
       * @api public
       */
    }, {
      key: "abort",
      value: function abort() {
        this.cleanup();
      }
    }]);
    return Request;
  }(Emitter);
  Request.requestsCount = 0;
  Request.requests = {};
  /**
   * Aborts pending requests when unloading the window. This is needed to prevent
   * memory leaks (e.g. when using IE) and to ensure that no spurious error is
   * emitted.
   */

  if (typeof document !== "undefined") {
    // @ts-ignore
    if (typeof attachEvent === "function") {
      // @ts-ignore
      attachEvent("onunload", unloadHandler);
    } else if (typeof addEventListener === "function") {
      var terminationEvent = "onpagehide" in globalThisShim ? "pagehide" : "unload";
      addEventListener(terminationEvent, unloadHandler, false);
    }
  }
  function unloadHandler() {
    for (var i in Request.requests) {
      if (Request.requests.hasOwnProperty(i)) {
        Request.requests[i].abort();
      }
    }
  }
  var nextTick = function () {
    var isPromiseAvailable = typeof Promise === "function" && typeof Promise.resolve === "function";
    if (isPromiseAvailable) {
      return function (cb) {
        return Promise.resolve().then(cb);
      };
    } else {
      return function (cb, setTimeoutFn) {
        return setTimeoutFn(cb, 0);
      };
    }
  }();
  var WebSocket = globalThisShim.WebSocket || globalThisShim.MozWebSocket;
  var usingBrowserWebSocket = true;
  var defaultBinaryType = "arraybuffer";
  var isReactNative = typeof navigator !== "undefined" && typeof navigator.product === "string" && navigator.product.toLowerCase() === "reactnative";
  var WS = /*#__PURE__*/function (_Transport) {
    _inherits(WS, _Transport);
    var _super = _createSuper(WS);

    /**
     * WebSocket transport constructor.
     *
     * @api {Object} connection options
     * @api public
     */
    function WS(opts) {
      var _this;
      _classCallCheck(this, WS);
      _this = _super.call(this, opts);
      _this.supportsBinary = !opts.forceBase64;
      return _this;
    }
    /**
     * Transport name.
     *
     * @api public
     */

    _createClass(WS, [{
      key: "name",
      get: function get() {
        return "websocket";
      }
      /**
       * Opens socket.
       *
       * @api private
       */
    }, {
      key: "doOpen",
      value: function doOpen() {
        if (!this.check()) {
          // let probe timeout
          return;
        }
        var uri = this.uri();
        var protocols = this.opts.protocols; // React Native only supports the 'headers' option, and will print a warning if anything else is passed

        var opts = isReactNative ? {} : pick(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
        if (this.opts.extraHeaders) {
          opts.headers = this.opts.extraHeaders;
        }
        try {
          this.ws = usingBrowserWebSocket && !isReactNative ? protocols ? new WebSocket(uri, protocols) : new WebSocket(uri) : new WebSocket(uri, protocols, opts);
        } catch (err) {
          return this.emitReserved("error", err);
        }
        this.ws.binaryType = this.socket.binaryType || defaultBinaryType;
        this.addEventListeners();
      }
      /**
       * Adds event listeners to the socket
       *
       * @api private
       */
    }, {
      key: "addEventListeners",
      value: function addEventListeners() {
        var _this2 = this;
        this.ws.onopen = function () {
          if (_this2.opts.autoUnref) {
            _this2.ws._socket.unref();
          }
          _this2.onOpen();
        };
        this.ws.onclose = function (closeEvent) {
          return _this2.onClose({
            description: "websocket connection closed",
            context: closeEvent
          });
        };
        this.ws.onmessage = function (ev) {
          return _this2.onData(ev.data);
        };
        this.ws.onerror = function (e) {
          return _this2.onError("websocket error", e);
        };
      }
      /**
       * Writes data to socket.
       *
       * @param {Array} array of packets.
       * @api private
       */
    }, {
      key: "write",
      value: function write(packets) {
        var _this3 = this;
        this.writable = false; // encodePacket efficient as it uses WS framing
        // no need for encodePayload

        var _loop = function _loop(i) {
          var packet = packets[i];
          var lastPacket = i === packets.length - 1;
          encodePacket(packet, _this3.supportsBinary, function (data) {
            // always create a new object (GH-437)
            var opts = {};
            // have a chance of informing us about it yet, in that case send will
            // throw an error

            try {
              if (usingBrowserWebSocket) {
                // TypeError is thrown when passing the second argument on Safari
                _this3.ws.send(data);
              }
            } catch (e) {}
            if (lastPacket) {
              // fake drain
              // defer to next tick to allow Socket to clear writeBuffer
              nextTick(function () {
                _this3.writable = true;
                _this3.emitReserved("drain");
              }, _this3.setTimeoutFn);
            }
          });
        };
        for (var i = 0; i < packets.length; i++) {
          _loop(i);
        }
      }
      /**
       * Closes socket.
       *
       * @api private
       */
    }, {
      key: "doClose",
      value: function doClose() {
        if (typeof this.ws !== "undefined") {
          this.ws.close();
          this.ws = null;
        }
      }
      /**
       * Generates uri for connection.
       *
       * @api private
       */
    }, {
      key: "uri",
      value: function uri() {
        var query = this.query || {};
        var schema = this.opts.secure ? "wss" : "ws";
        var port = ""; // avoid port if default for schema

        if (this.opts.port && ("wss" === schema && Number(this.opts.port) !== 443 || "ws" === schema && Number(this.opts.port) !== 80)) {
          port = ":" + this.opts.port;
        } // append timestamp to URI

        if (this.opts.timestampRequests) {
          query[this.opts.timestampParam] = yeast();
        } // communicate binary support capabilities

        if (!this.supportsBinary) {
          query.b64 = 1;
        }
        var encodedQuery = encode(query);
        var ipv6 = this.opts.hostname.indexOf(":") !== -1;
        return schema + "://" + (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) + port + this.opts.path + (encodedQuery.length ? "?" + encodedQuery : "");
      }
      /**
       * Feature detection for WebSocket.
       *
       * @return {Boolean} whether this transport is available.
       * @api public
       */
    }, {
      key: "check",
      value: function check() {
        return !!WebSocket;
      }
    }]);
    return WS;
  }(Transport);
  var transports = {
    websocket: WS,
    polling: Polling
  };

  // imported from https://github.com/galkn/parseuri

  /**
   * Parses an URI
   *
   * @author Steven Levithan <stevenlevithan.com> (MIT license)
   * @api private
   */
  var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
  var parts = ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'];
  function parse(str) {
    var src = str,
      b = str.indexOf('['),
      e = str.indexOf(']');
    if (b != -1 && e != -1) {
      str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
    }
    var m = re.exec(str || ''),
      uri = {},
      i = 14;
    while (i--) {
      uri[parts[i]] = m[i] || '';
    }
    if (b != -1 && e != -1) {
      uri.source = src;
      uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
      uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
      uri.ipv6uri = true;
    }
    uri.pathNames = pathNames(uri, uri['path']);
    uri.queryKey = queryKey(uri, uri['query']);
    return uri;
  }
  function pathNames(obj, path) {
    var regx = /\/{2,9}/g,
      names = path.replace(regx, "/").split("/");
    if (path.slice(0, 1) == '/' || path.length === 0) {
      names.splice(0, 1);
    }
    if (path.slice(-1) == '/') {
      names.splice(names.length - 1, 1);
    }
    return names;
  }
  function queryKey(uri, query) {
    var data = {};
    query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function ($0, $1, $2) {
      if ($1) {
        data[$1] = $2;
      }
    });
    return data;
  }
  var Socket$1 = /*#__PURE__*/function (_Emitter) {
    _inherits(Socket, _Emitter);
    var _super = _createSuper(Socket);

    /**
     * Socket constructor.
     *
     * @param {String|Object} uri or options
     * @param {Object} opts - options
     * @api public
     */
    function Socket(uri) {
      var _this;
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      _classCallCheck(this, Socket);
      _this = _super.call(this);
      if (uri && "object" === _typeof(uri)) {
        opts = uri;
        uri = null;
      }
      if (uri) {
        uri = parse(uri);
        opts.hostname = uri.host;
        opts.secure = uri.protocol === "https" || uri.protocol === "wss";
        opts.port = uri.port;
        if (uri.query) opts.query = uri.query;
      } else if (opts.host) {
        opts.hostname = parse(opts.host).host;
      }
      installTimerFunctions(_assertThisInitialized(_this), opts);
      _this.secure = null != opts.secure ? opts.secure : typeof location !== "undefined" && "https:" === location.protocol;
      if (opts.hostname && !opts.port) {
        // if no port is specified manually, use the protocol default
        opts.port = _this.secure ? "443" : "80";
      }
      _this.hostname = opts.hostname || (typeof location !== "undefined" ? location.hostname : "localhost");
      _this.port = opts.port || (typeof location !== "undefined" && location.port ? location.port : _this.secure ? "443" : "80");
      _this.transports = opts.transports || ["polling", "websocket"];
      _this.readyState = "";
      _this.writeBuffer = [];
      _this.prevBufferLen = 0;
      _this.opts = _extends({
        path: "/engine.io",
        agent: false,
        withCredentials: false,
        upgrade: true,
        timestampParam: "t",
        rememberUpgrade: false,
        rejectUnauthorized: true,
        perMessageDeflate: {
          threshold: 1024
        },
        transportOptions: {},
        closeOnBeforeunload: true
      }, opts);
      _this.opts.path = _this.opts.path.replace(/\/$/, "") + "/";
      if (typeof _this.opts.query === "string") {
        _this.opts.query = decode(_this.opts.query);
      } // set on handshake

      _this.id = null;
      _this.upgrades = null;
      _this.pingInterval = null;
      _this.pingTimeout = null; // set on heartbeat

      _this.pingTimeoutTimer = null;
      if (typeof addEventListener === "function") {
        if (_this.opts.closeOnBeforeunload) {
          // Firefox closes the connection when the "beforeunload" event is emitted but not Chrome. This event listener
          // ensures every browser behaves the same (no "disconnect" event at the Socket.IO level when the page is
          // closed/reloaded)
          _this.beforeunloadEventListener = function () {
            if (_this.transport) {
              // silently close the transport
              _this.transport.removeAllListeners();
              _this.transport.close();
            }
          };
          addEventListener("beforeunload", _this.beforeunloadEventListener, false);
        }
        if (_this.hostname !== "localhost") {
          _this.offlineEventListener = function () {
            _this.onClose("transport close", {
              description: "network connection lost"
            });
          };
          addEventListener("offline", _this.offlineEventListener, false);
        }
      }
      _this.open();
      return _this;
    }
    /**
     * Creates transport of the given type.
     *
     * @param {String} transport name
     * @return {Transport}
     * @api private
     */

    _createClass(Socket, [{
      key: "createTransport",
      value: function createTransport(name) {
        var query = _extends({}, this.opts.query); // append engine.io protocol identifier

        query.EIO = protocol$1; // transport name

        query.transport = name; // session id if we already have one

        if (this.id) query.sid = this.id;
        var opts = _extends({}, this.opts.transportOptions[name], this.opts, {
          query: query,
          socket: this,
          hostname: this.hostname,
          secure: this.secure,
          port: this.port
        });
        return new transports[name](opts);
      }
      /**
       * Initializes transport to use and starts probe.
       *
       * @api private
       */
    }, {
      key: "open",
      value: function open() {
        var _this2 = this;
        var transport;
        if (this.opts.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1) {
          transport = "websocket";
        } else if (0 === this.transports.length) {
          // Emit error on next tick so it can be listened to
          this.setTimeoutFn(function () {
            _this2.emitReserved("error", "No transports available");
          }, 0);
          return;
        } else {
          transport = this.transports[0];
        }
        this.readyState = "opening"; // Retry with the next transport if the transport is disabled (jsonp: false)

        try {
          transport = this.createTransport(transport);
        } catch (e) {
          this.transports.shift();
          this.open();
          return;
        }
        transport.open();
        this.setTransport(transport);
      }
      /**
       * Sets the current transport. Disables the existing one (if any).
       *
       * @api private
       */
    }, {
      key: "setTransport",
      value: function setTransport(transport) {
        var _this3 = this;
        if (this.transport) {
          this.transport.removeAllListeners();
        } // set up transport

        this.transport = transport; // set up transport listeners

        transport.on("drain", this.onDrain.bind(this)).on("packet", this.onPacket.bind(this)).on("error", this.onError.bind(this)).on("close", function (reason) {
          return _this3.onClose("transport close", reason);
        });
      }
      /**
       * Probes a transport.
       *
       * @param {String} transport name
       * @api private
       */
    }, {
      key: "probe",
      value: function probe(name) {
        var _this4 = this;
        var transport = this.createTransport(name);
        var failed = false;
        Socket.priorWebsocketSuccess = false;
        var onTransportOpen = function onTransportOpen() {
          if (failed) return;
          transport.send([{
            type: "ping",
            data: "probe"
          }]);
          transport.once("packet", function (msg) {
            if (failed) return;
            if ("pong" === msg.type && "probe" === msg.data) {
              _this4.upgrading = true;
              _this4.emitReserved("upgrading", transport);
              if (!transport) return;
              Socket.priorWebsocketSuccess = "websocket" === transport.name;
              _this4.transport.pause(function () {
                if (failed) return;
                if ("closed" === _this4.readyState) return;
                cleanup();
                _this4.setTransport(transport);
                transport.send([{
                  type: "upgrade"
                }]);
                _this4.emitReserved("upgrade", transport);
                transport = null;
                _this4.upgrading = false;
                _this4.flush();
              });
            } else {
              var err = new Error("probe error"); // @ts-ignore

              err.transport = transport.name;
              _this4.emitReserved("upgradeError", err);
            }
          });
        };
        function freezeTransport() {
          if (failed) return; // Any callback called by transport should be ignored since now

          failed = true;
          cleanup();
          transport.close();
          transport = null;
        } // Handle any error that happens while probing

        var onerror = function onerror(err) {
          var error = new Error("probe error: " + err); // @ts-ignore

          error.transport = transport.name;
          freezeTransport();
          _this4.emitReserved("upgradeError", error);
        };
        function onTransportClose() {
          onerror("transport closed");
        } // When the socket is closed while we're probing

        function onclose() {
          onerror("socket closed");
        } // When the socket is upgraded while we're probing

        function onupgrade(to) {
          if (transport && to.name !== transport.name) {
            freezeTransport();
          }
        } // Remove all listeners on the transport and on self

        var cleanup = function cleanup() {
          transport.removeListener("open", onTransportOpen);
          transport.removeListener("error", onerror);
          transport.removeListener("close", onTransportClose);
          _this4.off("close", onclose);
          _this4.off("upgrading", onupgrade);
        };
        transport.once("open", onTransportOpen);
        transport.once("error", onerror);
        transport.once("close", onTransportClose);
        this.once("close", onclose);
        this.once("upgrading", onupgrade);
        transport.open();
      }
      /**
       * Called when connection is deemed open.
       *
       * @api private
       */
    }, {
      key: "onOpen",
      value: function onOpen() {
        this.readyState = "open";
        Socket.priorWebsocketSuccess = "websocket" === this.transport.name;
        this.emitReserved("open");
        this.flush(); // we check for `readyState` in case an `open`
        // listener already closed the socket

        if ("open" === this.readyState && this.opts.upgrade && this.transport.pause) {
          var i = 0;
          var l = this.upgrades.length;
          for (; i < l; i++) {
            this.probe(this.upgrades[i]);
          }
        }
      }
      /**
       * Handles a packet.
       *
       * @api private
       */
    }, {
      key: "onPacket",
      value: function onPacket(packet) {
        if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
          this.emitReserved("packet", packet); // Socket is live - any packet counts

          this.emitReserved("heartbeat");
          switch (packet.type) {
            case "open":
              this.onHandshake(JSON.parse(packet.data));
              break;
            case "ping":
              this.resetPingTimeout();
              this.sendPacket("pong");
              this.emitReserved("ping");
              this.emitReserved("pong");
              break;
            case "error":
              var err = new Error("server error"); // @ts-ignore

              err.code = packet.data;
              this.onError(err);
              break;
            case "message":
              this.emitReserved("data", packet.data);
              this.emitReserved("message", packet.data);
              break;
          }
        }
      }
      /**
       * Called upon handshake completion.
       *
       * @param {Object} data - handshake obj
       * @api private
       */
    }, {
      key: "onHandshake",
      value: function onHandshake(data) {
        this.emitReserved("handshake", data);
        this.id = data.sid;
        this.transport.query.sid = data.sid;
        this.upgrades = this.filterUpgrades(data.upgrades);
        this.pingInterval = data.pingInterval;
        this.pingTimeout = data.pingTimeout;
        this.maxPayload = data.maxPayload;
        this.onOpen(); // In case open handler closes socket

        if ("closed" === this.readyState) return;
        this.resetPingTimeout();
      }
      /**
       * Sets and resets ping timeout timer based on server pings.
       *
       * @api private
       */
    }, {
      key: "resetPingTimeout",
      value: function resetPingTimeout() {
        var _this5 = this;
        this.clearTimeoutFn(this.pingTimeoutTimer);
        this.pingTimeoutTimer = this.setTimeoutFn(function () {
          _this5.onClose("ping timeout");
        }, this.pingInterval + this.pingTimeout);
        if (this.opts.autoUnref) {
          this.pingTimeoutTimer.unref();
        }
      }
      /**
       * Called on `drain` event
       *
       * @api private
       */
    }, {
      key: "onDrain",
      value: function onDrain() {
        this.writeBuffer.splice(0, this.prevBufferLen); // setting prevBufferLen = 0 is very important
        // for example, when upgrading, upgrade packet is sent over,
        // and a nonzero prevBufferLen could cause problems on `drain`

        this.prevBufferLen = 0;
        if (0 === this.writeBuffer.length) {
          this.emitReserved("drain");
        } else {
          this.flush();
        }
      }
      /**
       * Flush write buffers.
       *
       * @api private
       */
    }, {
      key: "flush",
      value: function flush() {
        if ("closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
          var packets = this.getWritablePackets();
          this.transport.send(packets); // keep track of current length of writeBuffer
          // splice writeBuffer and callbackBuffer on `drain`

          this.prevBufferLen = packets.length;
          this.emitReserved("flush");
        }
      }
      /**
       * Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
       * long-polling)
       *
       * @private
       */
    }, {
      key: "getWritablePackets",
      value: function getWritablePackets() {
        var shouldCheckPayloadSize = this.maxPayload && this.transport.name === "polling" && this.writeBuffer.length > 1;
        if (!shouldCheckPayloadSize) {
          return this.writeBuffer;
        }
        var payloadSize = 1; // first packet type

        for (var i = 0; i < this.writeBuffer.length; i++) {
          var data = this.writeBuffer[i].data;
          if (data) {
            payloadSize += byteLength(data);
          }
          if (i > 0 && payloadSize > this.maxPayload) {
            return this.writeBuffer.slice(0, i);
          }
          payloadSize += 2; // separator + packet type
        }

        return this.writeBuffer;
      }
      /**
       * Sends a message.
       *
       * @param {String} message.
       * @param {Function} callback function.
       * @param {Object} options.
       * @return {Socket} for chaining.
       * @api public
       */
    }, {
      key: "write",
      value: function write(msg, options, fn) {
        this.sendPacket("message", msg, options, fn);
        return this;
      }
    }, {
      key: "send",
      value: function send(msg, options, fn) {
        this.sendPacket("message", msg, options, fn);
        return this;
      }
      /**
       * Sends a packet.
       *
       * @param {String} packet type.
       * @param {String} data.
       * @param {Object} options.
       * @param {Function} callback function.
       * @api private
       */
    }, {
      key: "sendPacket",
      value: function sendPacket(type, data, options, fn) {
        if ("function" === typeof data) {
          fn = data;
          data = undefined;
        }
        if ("function" === typeof options) {
          fn = options;
          options = null;
        }
        if ("closing" === this.readyState || "closed" === this.readyState) {
          return;
        }
        options = options || {};
        options.compress = false !== options.compress;
        var packet = {
          type: type,
          data: data,
          options: options
        };
        this.emitReserved("packetCreate", packet);
        this.writeBuffer.push(packet);
        if (fn) this.once("flush", fn);
        this.flush();
      }
      /**
       * Closes the connection.
       *
       * @api public
       */
    }, {
      key: "close",
      value: function close() {
        var _this6 = this;
        var close = function close() {
          _this6.onClose("forced close");
          _this6.transport.close();
        };
        var cleanupAndClose = function cleanupAndClose() {
          _this6.off("upgrade", cleanupAndClose);
          _this6.off("upgradeError", cleanupAndClose);
          close();
        };
        var waitForUpgrade = function waitForUpgrade() {
          // wait for upgrade to finish since we can't send packets while pausing a transport
          _this6.once("upgrade", cleanupAndClose);
          _this6.once("upgradeError", cleanupAndClose);
        };
        if ("opening" === this.readyState || "open" === this.readyState) {
          this.readyState = "closing";
          if (this.writeBuffer.length) {
            this.once("drain", function () {
              if (_this6.upgrading) {
                waitForUpgrade();
              } else {
                close();
              }
            });
          } else if (this.upgrading) {
            waitForUpgrade();
          } else {
            close();
          }
        }
        return this;
      }
      /**
       * Called upon transport error
       *
       * @api private
       */
    }, {
      key: "onError",
      value: function onError(err) {
        Socket.priorWebsocketSuccess = false;
        this.emitReserved("error", err);
        this.onClose("transport error", err);
      }
      /**
       * Called upon transport close.
       *
       * @api private
       */
    }, {
      key: "onClose",
      value: function onClose(reason, description) {
        if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
          // clear timers
          this.clearTimeoutFn(this.pingTimeoutTimer); // stop event from firing again for transport

          this.transport.removeAllListeners("close"); // ensure transport won't stay open

          this.transport.close(); // ignore further transport communication

          this.transport.removeAllListeners();
          if (typeof removeEventListener === "function") {
            removeEventListener("beforeunload", this.beforeunloadEventListener, false);
            removeEventListener("offline", this.offlineEventListener, false);
          } // set ready state

          this.readyState = "closed"; // clear session id

          this.id = null; // emit close event

          this.emitReserved("close", reason, description); // clean buffers after, so users can still
          // grab the buffers on `close` event

          this.writeBuffer = [];
          this.prevBufferLen = 0;
        }
      }
      /**
       * Filters upgrades, returning only those matching client transports.
       *
       * @param {Array} server upgrades
       * @api private
       *
       */
    }, {
      key: "filterUpgrades",
      value: function filterUpgrades(upgrades) {
        var filteredUpgrades = [];
        var i = 0;
        var j = upgrades.length;
        for (; i < j; i++) {
          if (~this.transports.indexOf(upgrades[i])) filteredUpgrades.push(upgrades[i]);
        }
        return filteredUpgrades;
      }
    }]);
    return Socket;
  }(Emitter);
  Socket$1.protocol = protocol$1;
  Socket$1.protocol;

  /**
   * URL parser.
   *
   * @param uri - url
   * @param path - the request path of the connection
   * @param loc - An object meant to mimic window.location.
   *        Defaults to window.location.
   * @public
   */

  function url(uri) {
    var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var loc = arguments.length > 2 ? arguments[2] : undefined;
    var obj = uri; // default to window.location

    loc = loc || typeof location !== "undefined" && location;
    if (null == uri) uri = loc.protocol + "//" + loc.host; // relative path support

    if (typeof uri === "string") {
      if ("/" === uri.charAt(0)) {
        if ("/" === uri.charAt(1)) {
          uri = loc.protocol + uri;
        } else {
          uri = loc.host + uri;
        }
      }
      if (!/^(https?|wss?):\/\//.test(uri)) {
        if ("undefined" !== typeof loc) {
          uri = loc.protocol + "//" + uri;
        } else {
          uri = "https://" + uri;
        }
      } // parse

      obj = parse(uri);
    } // make sure we treat `localhost:80` and `localhost` equally

    if (!obj.port) {
      if (/^(http|ws)$/.test(obj.protocol)) {
        obj.port = "80";
      } else if (/^(http|ws)s$/.test(obj.protocol)) {
        obj.port = "443";
      }
    }
    obj.path = obj.path || "/";
    var ipv6 = obj.host.indexOf(":") !== -1;
    var host = ipv6 ? "[" + obj.host + "]" : obj.host; // define unique id

    obj.id = obj.protocol + "://" + host + ":" + obj.port + path; // define href

    obj.href = obj.protocol + "://" + host + (loc && loc.port === obj.port ? "" : ":" + obj.port);
    return obj;
  }
  var withNativeArrayBuffer = typeof ArrayBuffer === "function";
  var isView = function isView(obj) {
    return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj.buffer instanceof ArrayBuffer;
  };
  var toString = Object.prototype.toString;
  var withNativeBlob = typeof Blob === "function" || typeof Blob !== "undefined" && toString.call(Blob) === "[object BlobConstructor]";
  var withNativeFile = typeof File === "function" || typeof File !== "undefined" && toString.call(File) === "[object FileConstructor]";
  /**
   * Returns true if obj is a Buffer, an ArrayBuffer, a Blob or a File.
   *
   * @private
   */

  function isBinary(obj) {
    return withNativeArrayBuffer && (obj instanceof ArrayBuffer || isView(obj)) || withNativeBlob && obj instanceof Blob || withNativeFile && obj instanceof File;
  }
  function hasBinary(obj, toJSON) {
    if (!obj || _typeof(obj) !== "object") {
      return false;
    }
    if (Array.isArray(obj)) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (hasBinary(obj[i])) {
          return true;
        }
      }
      return false;
    }
    if (isBinary(obj)) {
      return true;
    }
    if (obj.toJSON && typeof obj.toJSON === "function" && arguments.length === 1) {
      return hasBinary(obj.toJSON(), true);
    }
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
        return true;
      }
    }
    return false;
  }

  /**
   * Replaces every Buffer | ArrayBuffer | Blob | File in packet with a numbered placeholder.
   *
   * @param {Object} packet - socket.io event packet
   * @return {Object} with deconstructed packet and list of buffers
   * @public
   */

  function deconstructPacket(packet) {
    var buffers = [];
    var packetData = packet.data;
    var pack = packet;
    pack.data = _deconstructPacket(packetData, buffers);
    pack.attachments = buffers.length; // number of binary 'attachments'

    return {
      packet: pack,
      buffers: buffers
    };
  }
  function _deconstructPacket(data, buffers) {
    if (!data) return data;
    if (isBinary(data)) {
      var placeholder = {
        _placeholder: true,
        num: buffers.length
      };
      buffers.push(data);
      return placeholder;
    } else if (Array.isArray(data)) {
      var newData = new Array(data.length);
      for (var i = 0; i < data.length; i++) {
        newData[i] = _deconstructPacket(data[i], buffers);
      }
      return newData;
    } else if (_typeof(data) === "object" && !(data instanceof Date)) {
      var _newData = {};
      for (var key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          _newData[key] = _deconstructPacket(data[key], buffers);
        }
      }
      return _newData;
    }
    return data;
  }
  /**
   * Reconstructs a binary packet from its placeholder packet and buffers
   *
   * @param {Object} packet - event packet with placeholders
   * @param {Array} buffers - binary buffers to put in placeholder positions
   * @return {Object} reconstructed packet
   * @public
   */

  function reconstructPacket(packet, buffers) {
    packet.data = _reconstructPacket(packet.data, buffers);
    packet.attachments = undefined; // no longer useful

    return packet;
  }
  function _reconstructPacket(data, buffers) {
    if (!data) return data;
    if (data && data._placeholder === true) {
      var isIndexValid = typeof data.num === "number" && data.num >= 0 && data.num < buffers.length;
      if (isIndexValid) {
        return buffers[data.num]; // appropriate buffer (should be natural order anyway)
      } else {
        throw new Error("illegal attachments");
      }
    } else if (Array.isArray(data)) {
      for (var i = 0; i < data.length; i++) {
        data[i] = _reconstructPacket(data[i], buffers);
      }
    } else if (_typeof(data) === "object") {
      for (var key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          data[key] = _reconstructPacket(data[key], buffers);
        }
      }
    }
    return data;
  }

  /**
   * Protocol version.
   *
   * @public
   */

  var protocol = 5;
  var PacketType;
  (function (PacketType) {
    PacketType[PacketType["CONNECT"] = 0] = "CONNECT";
    PacketType[PacketType["DISCONNECT"] = 1] = "DISCONNECT";
    PacketType[PacketType["EVENT"] = 2] = "EVENT";
    PacketType[PacketType["ACK"] = 3] = "ACK";
    PacketType[PacketType["CONNECT_ERROR"] = 4] = "CONNECT_ERROR";
    PacketType[PacketType["BINARY_EVENT"] = 5] = "BINARY_EVENT";
    PacketType[PacketType["BINARY_ACK"] = 6] = "BINARY_ACK";
  })(PacketType || (PacketType = {}));
  /**
   * A socket.io Encoder instance
   */

  var Encoder = /*#__PURE__*/function () {
    /**
     * Encoder constructor
     *
     * @param {function} replacer - custom replacer to pass down to JSON.parse
     */
    function Encoder(replacer) {
      _classCallCheck(this, Encoder);
      this.replacer = replacer;
    }
    /**
     * Encode a packet as a single string if non-binary, or as a
     * buffer sequence, depending on packet type.
     *
     * @param {Object} obj - packet object
     */

    _createClass(Encoder, [{
      key: "encode",
      value: function encode(obj) {
        if (obj.type === PacketType.EVENT || obj.type === PacketType.ACK) {
          if (hasBinary(obj)) {
            obj.type = obj.type === PacketType.EVENT ? PacketType.BINARY_EVENT : PacketType.BINARY_ACK;
            return this.encodeAsBinary(obj);
          }
        }
        return [this.encodeAsString(obj)];
      }
      /**
       * Encode packet as string.
       */
    }, {
      key: "encodeAsString",
      value: function encodeAsString(obj) {
        // first is type
        var str = "" + obj.type; // attachments if we have them

        if (obj.type === PacketType.BINARY_EVENT || obj.type === PacketType.BINARY_ACK) {
          str += obj.attachments + "-";
        } // if we have a namespace other than `/`
        // we append it followed by a comma `,`

        if (obj.nsp && "/" !== obj.nsp) {
          str += obj.nsp + ",";
        } // immediately followed by the id

        if (null != obj.id) {
          str += obj.id;
        } // json data

        if (null != obj.data) {
          str += JSON.stringify(obj.data, this.replacer);
        }
        return str;
      }
      /**
       * Encode packet as 'buffer sequence' by removing blobs, and
       * deconstructing packet into object with placeholders and
       * a list of buffers.
       */
    }, {
      key: "encodeAsBinary",
      value: function encodeAsBinary(obj) {
        var deconstruction = deconstructPacket(obj);
        var pack = this.encodeAsString(deconstruction.packet);
        var buffers = deconstruction.buffers;
        buffers.unshift(pack); // add packet info to beginning of data list

        return buffers; // write all the buffers
      }
    }]);

    return Encoder;
  }();
  /**
   * A socket.io Decoder instance
   *
   * @return {Object} decoder
   */

  var Decoder = /*#__PURE__*/function (_Emitter) {
    _inherits(Decoder, _Emitter);
    var _super = _createSuper(Decoder);

    /**
     * Decoder constructor
     *
     * @param {function} reviver - custom reviver to pass down to JSON.stringify
     */
    function Decoder(reviver) {
      var _this;
      _classCallCheck(this, Decoder);
      _this = _super.call(this);
      _this.reviver = reviver;
      return _this;
    }
    /**
     * Decodes an encoded packet string into packet JSON.
     *
     * @param {String} obj - encoded packet
     */

    _createClass(Decoder, [{
      key: "add",
      value: function add(obj) {
        var packet;
        if (typeof obj === "string") {
          if (this.reconstructor) {
            throw new Error("got plaintext data when reconstructing a packet");
          }
          packet = this.decodeString(obj);
          if (packet.type === PacketType.BINARY_EVENT || packet.type === PacketType.BINARY_ACK) {
            // binary packet's json
            this.reconstructor = new BinaryReconstructor(packet); // no attachments, labeled binary but no binary data to follow

            if (packet.attachments === 0) {
              _get(_getPrototypeOf(Decoder.prototype), "emitReserved", this).call(this, "decoded", packet);
            }
          } else {
            // non-binary full packet
            _get(_getPrototypeOf(Decoder.prototype), "emitReserved", this).call(this, "decoded", packet);
          }
        } else if (isBinary(obj) || obj.base64) {
          // raw binary data
          if (!this.reconstructor) {
            throw new Error("got binary data when not reconstructing a packet");
          } else {
            packet = this.reconstructor.takeBinaryData(obj);
            if (packet) {
              // received final buffer
              this.reconstructor = null;
              _get(_getPrototypeOf(Decoder.prototype), "emitReserved", this).call(this, "decoded", packet);
            }
          }
        } else {
          throw new Error("Unknown type: " + obj);
        }
      }
      /**
       * Decode a packet String (JSON data)
       *
       * @param {String} str
       * @return {Object} packet
       */
    }, {
      key: "decodeString",
      value: function decodeString(str) {
        var i = 0; // look up type

        var p = {
          type: Number(str.charAt(0))
        };
        if (PacketType[p.type] === undefined) {
          throw new Error("unknown packet type " + p.type);
        } // look up attachments if type binary

        if (p.type === PacketType.BINARY_EVENT || p.type === PacketType.BINARY_ACK) {
          var start = i + 1;
          while (str.charAt(++i) !== "-" && i != str.length) {}
          var buf = str.substring(start, i);
          if (buf != Number(buf) || str.charAt(i) !== "-") {
            throw new Error("Illegal attachments");
          }
          p.attachments = Number(buf);
        } // look up namespace (if any)

        if ("/" === str.charAt(i + 1)) {
          var _start = i + 1;
          while (++i) {
            var c = str.charAt(i);
            if ("," === c) break;
            if (i === str.length) break;
          }
          p.nsp = str.substring(_start, i);
        } else {
          p.nsp = "/";
        } // look up id

        var next = str.charAt(i + 1);
        if ("" !== next && Number(next) == next) {
          var _start2 = i + 1;
          while (++i) {
            var _c = str.charAt(i);
            if (null == _c || Number(_c) != _c) {
              --i;
              break;
            }
            if (i === str.length) break;
          }
          p.id = Number(str.substring(_start2, i + 1));
        } // look up json data

        if (str.charAt(++i)) {
          var payload = this.tryParse(str.substr(i));
          if (Decoder.isPayloadValid(p.type, payload)) {
            p.data = payload;
          } else {
            throw new Error("invalid payload");
          }
        }
        return p;
      }
    }, {
      key: "tryParse",
      value: function tryParse(str) {
        try {
          return JSON.parse(str, this.reviver);
        } catch (e) {
          return false;
        }
      }
    }, {
      key: "destroy",
      value:
      /**
       * Deallocates a parser's resources
       */
      function destroy() {
        if (this.reconstructor) {
          this.reconstructor.finishedReconstruction();
        }
      }
    }], [{
      key: "isPayloadValid",
      value: function isPayloadValid(type, payload) {
        switch (type) {
          case PacketType.CONNECT:
            return _typeof(payload) === "object";
          case PacketType.DISCONNECT:
            return payload === undefined;
          case PacketType.CONNECT_ERROR:
            return typeof payload === "string" || _typeof(payload) === "object";
          case PacketType.EVENT:
          case PacketType.BINARY_EVENT:
            return Array.isArray(payload) && payload.length > 0;
          case PacketType.ACK:
          case PacketType.BINARY_ACK:
            return Array.isArray(payload);
        }
      }
    }]);
    return Decoder;
  }(Emitter);
  /**
   * A manager of a binary event's 'buffer sequence'. Should
   * be constructed whenever a packet of type BINARY_EVENT is
   * decoded.
   *
   * @param {Object} packet
   * @return {BinaryReconstructor} initialized reconstructor
   */

  var BinaryReconstructor = /*#__PURE__*/function () {
    function BinaryReconstructor(packet) {
      _classCallCheck(this, BinaryReconstructor);
      this.packet = packet;
      this.buffers = [];
      this.reconPack = packet;
    }
    /**
     * Method to be called when binary data received from connection
     * after a BINARY_EVENT packet.
     *
     * @param {Buffer | ArrayBuffer} binData - the raw binary data received
     * @return {null | Object} returns null if more binary data is expected or
     *   a reconstructed packet object if all buffers have been received.
     */

    _createClass(BinaryReconstructor, [{
      key: "takeBinaryData",
      value: function takeBinaryData(binData) {
        this.buffers.push(binData);
        if (this.buffers.length === this.reconPack.attachments) {
          // done with buffer list
          var packet = reconstructPacket(this.reconPack, this.buffers);
          this.finishedReconstruction();
          return packet;
        }
        return null;
      }
      /**
       * Cleans up binary packet reconstruction variables.
       */
    }, {
      key: "finishedReconstruction",
      value: function finishedReconstruction() {
        this.reconPack = null;
        this.buffers = [];
      }
    }]);
    return BinaryReconstructor;
  }();
  var parser = /*#__PURE__*/Object.freeze({
    __proto__: null,
    protocol: protocol,
    get PacketType() {
      return PacketType;
    },
    Encoder: Encoder,
    Decoder: Decoder
  });
  function on(obj, ev, fn) {
    obj.on(ev, fn);
    return function subDestroy() {
      obj.off(ev, fn);
    };
  }

  /**
   * Internal events.
   * These events can't be emitted by the user.
   */

  var RESERVED_EVENTS = Object.freeze({
    connect: 1,
    connect_error: 1,
    disconnect: 1,
    disconnecting: 1,
    // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
    newListener: 1,
    removeListener: 1
  });
  /**
   * A Socket is the fundamental class for interacting with the server.
   *
   * A Socket belongs to a certain Namespace (by default /) and uses an underlying {@link Manager} to communicate.
   *
   * @example
   * const socket = io();
   *
   * socket.on("connect", () => {
   *   console.log("connected");
   * });
   *
   * // send an event to the server
   * socket.emit("foo", "bar");
   *
   * socket.on("foobar", () => {
   *   // an event was received from the server
   * });
   *
   * // upon disconnection
   * socket.on("disconnect", (reason) => {
   *   console.log(`disconnected due to ${reason}`);
   * });
   */

  var Socket = /*#__PURE__*/function (_Emitter) {
    _inherits(Socket, _Emitter);
    var _super = _createSuper(Socket);

    /**
     * `Socket` constructor.
     */
    function Socket(io, nsp, opts) {
      var _this;
      _classCallCheck(this, Socket);
      _this = _super.call(this);
      /**
       * Whether the socket is currently connected to the server.
       *
       * @example
       * const socket = io();
       *
       * socket.on("connect", () => {
       *   console.log(socket.connected); // true
       * });
       *
       * socket.on("disconnect", () => {
       *   console.log(socket.connected); // false
       * });
       */

      _this.connected = false;
      /**
       * Buffer for packets received before the CONNECT packet
       */

      _this.receiveBuffer = [];
      /**
       * Buffer for packets that will be sent once the socket is connected
       */

      _this.sendBuffer = [];
      _this.ids = 0;
      _this.acks = {};
      _this.flags = {};
      _this.io = io;
      _this.nsp = nsp;
      if (opts && opts.auth) {
        _this.auth = opts.auth;
      }
      if (_this.io._autoConnect) _this.open();
      return _this;
    }
    /**
     * Whether the socket is currently disconnected
     *
     * @example
     * const socket = io();
     *
     * socket.on("connect", () => {
     *   console.log(socket.disconnected); // false
     * });
     *
     * socket.on("disconnect", () => {
     *   console.log(socket.disconnected); // true
     * });
     */

    _createClass(Socket, [{
      key: "disconnected",
      get: function get() {
        return !this.connected;
      }
      /**
       * Subscribe to open, close and packet events
       *
       * @private
       */
    }, {
      key: "subEvents",
      value: function subEvents() {
        if (this.subs) return;
        var io = this.io;
        this.subs = [on(io, "open", this.onopen.bind(this)), on(io, "packet", this.onpacket.bind(this)), on(io, "error", this.onerror.bind(this)), on(io, "close", this.onclose.bind(this))];
      }
      /**
       * Whether the Socket will try to reconnect when its Manager connects or reconnects.
       *
       * @example
       * const socket = io();
       *
       * console.log(socket.active); // true
       *
       * socket.on("disconnect", (reason) => {
       *   if (reason === "io server disconnect") {
       *     // the disconnection was initiated by the server, you need to manually reconnect
       *     console.log(socket.active); // false
       *   }
       *   // else the socket will automatically try to reconnect
       *   console.log(socket.active); // true
       * });
       */
    }, {
      key: "active",
      get: function get() {
        return !!this.subs;
      }
      /**
       * "Opens" the socket.
       *
       * @example
       * const socket = io({
       *   autoConnect: false
       * });
       *
       * socket.connect();
       */
    }, {
      key: "connect",
      value: function connect() {
        if (this.connected) return this;
        this.subEvents();
        if (!this.io["_reconnecting"]) this.io.open(); // ensure open

        if ("open" === this.io._readyState) this.onopen();
        return this;
      }
      /**
       * Alias for {@link connect()}.
       */
    }, {
      key: "open",
      value: function open() {
        return this.connect();
      }
      /**
       * Sends a `message` event.
       *
       * This method mimics the WebSocket.send() method.
       *
       * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
       *
       * @example
       * socket.send("hello");
       *
       * // this is equivalent to
       * socket.emit("message", "hello");
       *
       * @return self
       */
    }, {
      key: "send",
      value: function send() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        args.unshift("message");
        this.emit.apply(this, args);
        return this;
      }
      /**
       * Override `emit`.
       * If the event is in `events`, it's emitted normally.
       *
       * @example
       * socket.emit("hello", "world");
       *
       * // all serializable datastructures are supported (no need to call JSON.stringify)
       * socket.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
       *
       * // with an acknowledgement from the server
       * socket.emit("hello", "world", (val) => {
       *   // ...
       * });
       *
       * @return self
       */
    }, {
      key: "emit",
      value: function emit(ev) {
        if (RESERVED_EVENTS.hasOwnProperty(ev)) {
          throw new Error('"' + ev.toString() + '" is a reserved event name');
        }
        for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }
        args.unshift(ev);
        var packet = {
          type: PacketType.EVENT,
          data: args
        };
        packet.options = {};
        packet.options.compress = this.flags.compress !== false; // event ack callback

        if ("function" === typeof args[args.length - 1]) {
          var id = this.ids++;
          var ack = args.pop();
          this._registerAckCallback(id, ack);
          packet.id = id;
        }
        var isTransportWritable = this.io.engine && this.io.engine.transport && this.io.engine.transport.writable;
        var discardPacket = this.flags["volatile"] && (!isTransportWritable || !this.connected);
        if (discardPacket) ;else if (this.connected) {
          this.notifyOutgoingListeners(packet);
          this.packet(packet);
        } else {
          this.sendBuffer.push(packet);
        }
        this.flags = {};
        return this;
      }
      /**
       * @private
       */
    }, {
      key: "_registerAckCallback",
      value: function _registerAckCallback(id, ack) {
        var _this2 = this;
        var timeout = this.flags.timeout;
        if (timeout === undefined) {
          this.acks[id] = ack;
          return;
        } // @ts-ignore

        var timer = this.io.setTimeoutFn(function () {
          delete _this2.acks[id];
          for (var i = 0; i < _this2.sendBuffer.length; i++) {
            if (_this2.sendBuffer[i].id === id) {
              _this2.sendBuffer.splice(i, 1);
            }
          }
          ack.call(_this2, new Error("operation has timed out"));
        }, timeout);
        this.acks[id] = function () {
          // @ts-ignore
          _this2.io.clearTimeoutFn(timer);
          for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }
          ack.apply(_this2, [null].concat(args));
        };
      }
      /**
       * Sends a packet.
       *
       * @param packet
       * @private
       */
    }, {
      key: "packet",
      value: function packet(_packet) {
        _packet.nsp = this.nsp;
        this.io._packet(_packet);
      }
      /**
       * Called upon engine `open`.
       *
       * @private
       */
    }, {
      key: "onopen",
      value: function onopen() {
        var _this3 = this;
        if (typeof this.auth == "function") {
          this.auth(function (data) {
            _this3.packet({
              type: PacketType.CONNECT,
              data: data
            });
          });
        } else {
          this.packet({
            type: PacketType.CONNECT,
            data: this.auth
          });
        }
      }
      /**
       * Called upon engine or manager `error`.
       *
       * @param err
       * @private
       */
    }, {
      key: "onerror",
      value: function onerror(err) {
        if (!this.connected) {
          this.emitReserved("connect_error", err);
        }
      }
      /**
       * Called upon engine `close`.
       *
       * @param reason
       * @param description
       * @private
       */
    }, {
      key: "onclose",
      value: function onclose(reason, description) {
        this.connected = false;
        delete this.id;
        this.emitReserved("disconnect", reason, description);
      }
      /**
       * Called with socket packet.
       *
       * @param packet
       * @private
       */
    }, {
      key: "onpacket",
      value: function onpacket(packet) {
        var sameNamespace = packet.nsp === this.nsp;
        if (!sameNamespace) return;
        switch (packet.type) {
          case PacketType.CONNECT:
            if (packet.data && packet.data.sid) {
              var id = packet.data.sid;
              this.onconnect(id);
            } else {
              this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
            }
            break;
          case PacketType.EVENT:
          case PacketType.BINARY_EVENT:
            this.onevent(packet);
            break;
          case PacketType.ACK:
          case PacketType.BINARY_ACK:
            this.onack(packet);
            break;
          case PacketType.DISCONNECT:
            this.ondisconnect();
            break;
          case PacketType.CONNECT_ERROR:
            this.destroy();
            var err = new Error(packet.data.message); // @ts-ignore

            err.data = packet.data.data;
            this.emitReserved("connect_error", err);
            break;
        }
      }
      /**
       * Called upon a server event.
       *
       * @param packet
       * @private
       */
    }, {
      key: "onevent",
      value: function onevent(packet) {
        var args = packet.data || [];
        if (null != packet.id) {
          args.push(this.ack(packet.id));
        }
        if (this.connected) {
          this.emitEvent(args);
        } else {
          this.receiveBuffer.push(Object.freeze(args));
        }
      }
    }, {
      key: "emitEvent",
      value: function emitEvent(args) {
        if (this._anyListeners && this._anyListeners.length) {
          var listeners = this._anyListeners.slice();
          var _iterator = _createForOfIteratorHelper(listeners),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var listener = _step.value;
              listener.apply(this, args);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }
        _get(_getPrototypeOf(Socket.prototype), "emit", this).apply(this, args);
      }
      /**
       * Produces an ack callback to emit with an event.
       *
       * @private
       */
    }, {
      key: "ack",
      value: function ack(id) {
        var self = this;
        var sent = false;
        return function () {
          // prevent double callbacks
          if (sent) return;
          sent = true;
          for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }
          self.packet({
            type: PacketType.ACK,
            id: id,
            data: args
          });
        };
      }
      /**
       * Called upon a server acknowlegement.
       *
       * @param packet
       * @private
       */
    }, {
      key: "onack",
      value: function onack(packet) {
        var ack = this.acks[packet.id];
        if ("function" === typeof ack) {
          ack.apply(this, packet.data);
          delete this.acks[packet.id];
        }
      }
      /**
       * Called upon server connect.
       *
       * @private
       */
    }, {
      key: "onconnect",
      value: function onconnect(id) {
        this.id = id;
        this.connected = true;
        this.emitBuffered();
        this.emitReserved("connect");
      }
      /**
       * Emit buffered events (received and emitted).
       *
       * @private
       */
    }, {
      key: "emitBuffered",
      value: function emitBuffered() {
        var _this4 = this;
        this.receiveBuffer.forEach(function (args) {
          return _this4.emitEvent(args);
        });
        this.receiveBuffer = [];
        this.sendBuffer.forEach(function (packet) {
          _this4.notifyOutgoingListeners(packet);
          _this4.packet(packet);
        });
        this.sendBuffer = [];
      }
      /**
       * Called upon server disconnect.
       *
       * @private
       */
    }, {
      key: "ondisconnect",
      value: function ondisconnect() {
        this.destroy();
        this.onclose("io server disconnect");
      }
      /**
       * Called upon forced client/server side disconnections,
       * this method ensures the manager stops tracking us and
       * that reconnections don't get triggered for this.
       *
       * @private
       */
    }, {
      key: "destroy",
      value: function destroy() {
        if (this.subs) {
          // clean subscriptions to avoid reconnections
          this.subs.forEach(function (subDestroy) {
            return subDestroy();
          });
          this.subs = undefined;
        }
        this.io["_destroy"](this);
      }
      /**
       * Disconnects the socket manually. In that case, the socket will not try to reconnect.
       *
       * If this is the last active Socket instance of the {@link Manager}, the low-level connection will be closed.
       *
       * @example
       * const socket = io();
       *
       * socket.on("disconnect", (reason) => {
       *   // console.log(reason); prints "io client disconnect"
       * });
       *
       * socket.disconnect();
       *
       * @return self
       */
    }, {
      key: "disconnect",
      value: function disconnect() {
        if (this.connected) {
          this.packet({
            type: PacketType.DISCONNECT
          });
        } // remove socket from pool

        this.destroy();
        if (this.connected) {
          // fire events
          this.onclose("io client disconnect");
        }
        return this;
      }
      /**
       * Alias for {@link disconnect()}.
       *
       * @return self
       */
    }, {
      key: "close",
      value: function close() {
        return this.disconnect();
      }
      /**
       * Sets the compress flag.
       *
       * @example
       * socket.compress(false).emit("hello");
       *
       * @param compress - if `true`, compresses the sending data
       * @return self
       */
    }, {
      key: "compress",
      value: function compress(_compress) {
        this.flags.compress = _compress;
        return this;
      }
      /**
       * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
       * ready to send messages.
       *
       * @example
       * socket.volatile.emit("hello"); // the server may or may not receive it
       *
       * @returns self
       */
    }, {
      key: "volatile",
      get: function get() {
        this.flags["volatile"] = true;
        return this;
      }
      /**
       * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
       * given number of milliseconds have elapsed without an acknowledgement from the server:
       *
       * @example
       * socket.timeout(5000).emit("my-event", (err) => {
       *   if (err) {
       *     // the server did not acknowledge the event in the given delay
       *   }
       * });
       *
       * @returns self
       */
    }, {
      key: "timeout",
      value: function timeout(_timeout) {
        this.flags.timeout = _timeout;
        return this;
      }
      /**
       * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
       * callback.
       *
       * @example
       * socket.onAny((event, ...args) => {
       *   console.log(`got ${event}`);
       * });
       *
       * @param listener
       */
    }, {
      key: "onAny",
      value: function onAny(listener) {
        this._anyListeners = this._anyListeners || [];
        this._anyListeners.push(listener);
        return this;
      }
      /**
       * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
       * callback. The listener is added to the beginning of the listeners array.
       *
       * @example
       * socket.prependAny((event, ...args) => {
       *   console.log(`got event ${event}`);
       * });
       *
       * @param listener
       */
    }, {
      key: "prependAny",
      value: function prependAny(listener) {
        this._anyListeners = this._anyListeners || [];
        this._anyListeners.unshift(listener);
        return this;
      }
      /**
       * Removes the listener that will be fired when any event is emitted.
       *
       * @example
       * const catchAllListener = (event, ...args) => {
       *   console.log(`got event ${event}`);
       * }
       *
       * socket.onAny(catchAllListener);
       *
       * // remove a specific listener
       * socket.offAny(catchAllListener);
       *
       * // or remove all listeners
       * socket.offAny();
       *
       * @param listener
       */
    }, {
      key: "offAny",
      value: function offAny(listener) {
        if (!this._anyListeners) {
          return this;
        }
        if (listener) {
          var listeners = this._anyListeners;
          for (var i = 0; i < listeners.length; i++) {
            if (listener === listeners[i]) {
              listeners.splice(i, 1);
              return this;
            }
          }
        } else {
          this._anyListeners = [];
        }
        return this;
      }
      /**
       * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
       * e.g. to remove listeners.
       */
    }, {
      key: "listenersAny",
      value: function listenersAny() {
        return this._anyListeners || [];
      }
      /**
       * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
       * callback.
       *
       * Note: acknowledgements sent to the server are not included.
       *
       * @example
       * socket.onAnyOutgoing((event, ...args) => {
       *   console.log(`sent event ${event}`);
       * });
       *
       * @param listener
       */
    }, {
      key: "onAnyOutgoing",
      value: function onAnyOutgoing(listener) {
        this._anyOutgoingListeners = this._anyOutgoingListeners || [];
        this._anyOutgoingListeners.push(listener);
        return this;
      }
      /**
       * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
       * callback. The listener is added to the beginning of the listeners array.
       *
       * Note: acknowledgements sent to the server are not included.
       *
       * @example
       * socket.prependAnyOutgoing((event, ...args) => {
       *   console.log(`sent event ${event}`);
       * });
       *
       * @param listener
       */
    }, {
      key: "prependAnyOutgoing",
      value: function prependAnyOutgoing(listener) {
        this._anyOutgoingListeners = this._anyOutgoingListeners || [];
        this._anyOutgoingListeners.unshift(listener);
        return this;
      }
      /**
       * Removes the listener that will be fired when any event is emitted.
       *
       * @example
       * const catchAllListener = (event, ...args) => {
       *   console.log(`sent event ${event}`);
       * }
       *
       * socket.onAnyOutgoing(catchAllListener);
       *
       * // remove a specific listener
       * socket.offAnyOutgoing(catchAllListener);
       *
       * // or remove all listeners
       * socket.offAnyOutgoing();
       *
       * @param [listener] - the catch-all listener (optional)
       */
    }, {
      key: "offAnyOutgoing",
      value: function offAnyOutgoing(listener) {
        if (!this._anyOutgoingListeners) {
          return this;
        }
        if (listener) {
          var listeners = this._anyOutgoingListeners;
          for (var i = 0; i < listeners.length; i++) {
            if (listener === listeners[i]) {
              listeners.splice(i, 1);
              return this;
            }
          }
        } else {
          this._anyOutgoingListeners = [];
        }
        return this;
      }
      /**
       * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
       * e.g. to remove listeners.
       */
    }, {
      key: "listenersAnyOutgoing",
      value: function listenersAnyOutgoing() {
        return this._anyOutgoingListeners || [];
      }
      /**
       * Notify the listeners for each packet sent
       *
       * @param packet
       *
       * @private
       */
    }, {
      key: "notifyOutgoingListeners",
      value: function notifyOutgoingListeners(packet) {
        if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
          var listeners = this._anyOutgoingListeners.slice();
          var _iterator2 = _createForOfIteratorHelper(listeners),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var listener = _step2.value;
              listener.apply(this, packet.data);
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      }
    }]);
    return Socket;
  }(Emitter);

  /**
   * Initialize backoff timer with `opts`.
   *
   * - `min` initial timeout in milliseconds [100]
   * - `max` max timeout [10000]
   * - `jitter` [0]
   * - `factor` [2]
   *
   * @param {Object} opts
   * @api public
   */
  function Backoff(opts) {
    opts = opts || {};
    this.ms = opts.min || 100;
    this.max = opts.max || 10000;
    this.factor = opts.factor || 2;
    this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
    this.attempts = 0;
  }
  /**
   * Return the backoff duration.
   *
   * @return {Number}
   * @api public
   */

  Backoff.prototype.duration = function () {
    var ms = this.ms * Math.pow(this.factor, this.attempts++);
    if (this.jitter) {
      var rand = Math.random();
      var deviation = Math.floor(rand * this.jitter * ms);
      ms = (Math.floor(rand * 10) & 1) == 0 ? ms - deviation : ms + deviation;
    }
    return Math.min(ms, this.max) | 0;
  };
  /**
   * Reset the number of attempts.
   *
   * @api public
   */

  Backoff.prototype.reset = function () {
    this.attempts = 0;
  };
  /**
   * Set the minimum duration
   *
   * @api public
   */

  Backoff.prototype.setMin = function (min) {
    this.ms = min;
  };
  /**
   * Set the maximum duration
   *
   * @api public
   */

  Backoff.prototype.setMax = function (max) {
    this.max = max;
  };
  /**
   * Set the jitter
   *
   * @api public
   */

  Backoff.prototype.setJitter = function (jitter) {
    this.jitter = jitter;
  };
  var Manager = /*#__PURE__*/function (_Emitter) {
    _inherits(Manager, _Emitter);
    var _super = _createSuper(Manager);
    function Manager(uri, opts) {
      var _this;
      _classCallCheck(this, Manager);
      var _a;
      _this = _super.call(this);
      _this.nsps = {};
      _this.subs = [];
      if (uri && "object" === _typeof(uri)) {
        opts = uri;
        uri = undefined;
      }
      opts = opts || {};
      opts.path = opts.path || "/socket.io";
      _this.opts = opts;
      installTimerFunctions(_assertThisInitialized(_this), opts);
      _this.reconnection(opts.reconnection !== false);
      _this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
      _this.reconnectionDelay(opts.reconnectionDelay || 1000);
      _this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
      _this.randomizationFactor((_a = opts.randomizationFactor) !== null && _a !== void 0 ? _a : 0.5);
      _this.backoff = new Backoff({
        min: _this.reconnectionDelay(),
        max: _this.reconnectionDelayMax(),
        jitter: _this.randomizationFactor()
      });
      _this.timeout(null == opts.timeout ? 20000 : opts.timeout);
      _this._readyState = "closed";
      _this.uri = uri;
      var _parser = opts.parser || parser;
      _this.encoder = new _parser.Encoder();
      _this.decoder = new _parser.Decoder();
      _this._autoConnect = opts.autoConnect !== false;
      if (_this._autoConnect) _this.open();
      return _this;
    }
    _createClass(Manager, [{
      key: "reconnection",
      value: function reconnection(v) {
        if (!arguments.length) return this._reconnection;
        this._reconnection = !!v;
        return this;
      }
    }, {
      key: "reconnectionAttempts",
      value: function reconnectionAttempts(v) {
        if (v === undefined) return this._reconnectionAttempts;
        this._reconnectionAttempts = v;
        return this;
      }
    }, {
      key: "reconnectionDelay",
      value: function reconnectionDelay(v) {
        var _a;
        if (v === undefined) return this._reconnectionDelay;
        this._reconnectionDelay = v;
        (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMin(v);
        return this;
      }
    }, {
      key: "randomizationFactor",
      value: function randomizationFactor(v) {
        var _a;
        if (v === undefined) return this._randomizationFactor;
        this._randomizationFactor = v;
        (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setJitter(v);
        return this;
      }
    }, {
      key: "reconnectionDelayMax",
      value: function reconnectionDelayMax(v) {
        var _a;
        if (v === undefined) return this._reconnectionDelayMax;
        this._reconnectionDelayMax = v;
        (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMax(v);
        return this;
      }
    }, {
      key: "timeout",
      value: function timeout(v) {
        if (!arguments.length) return this._timeout;
        this._timeout = v;
        return this;
      }
      /**
       * Starts trying to reconnect if reconnection is enabled and we have not
       * started reconnecting yet
       *
       * @private
       */
    }, {
      key: "maybeReconnectOnOpen",
      value: function maybeReconnectOnOpen() {
        // Only try to reconnect if it's the first time we're connecting
        if (!this._reconnecting && this._reconnection && this.backoff.attempts === 0) {
          // keeps reconnection from firing twice for the same reconnection loop
          this.reconnect();
        }
      }
      /**
       * Sets the current transport `socket`.
       *
       * @param {Function} fn - optional, callback
       * @return self
       * @public
       */
    }, {
      key: "open",
      value: function open(fn) {
        var _this2 = this;
        if (~this._readyState.indexOf("open")) return this;
        this.engine = new Socket$1(this.uri, this.opts);
        var socket = this.engine;
        var self = this;
        this._readyState = "opening";
        this.skipReconnect = false; // emit `open`

        var openSubDestroy = on(socket, "open", function () {
          self.onopen();
          fn && fn();
        }); // emit `error`

        var errorSub = on(socket, "error", function (err) {
          self.cleanup();
          self._readyState = "closed";
          _this2.emitReserved("error", err);
          if (fn) {
            fn(err);
          } else {
            // Only do this if there is no fn to handle the error
            self.maybeReconnectOnOpen();
          }
        });
        if (false !== this._timeout) {
          var timeout = this._timeout;
          if (timeout === 0) {
            openSubDestroy(); // prevents a race condition with the 'open' event
          } // set timer

          var timer = this.setTimeoutFn(function () {
            openSubDestroy();
            socket.close(); // @ts-ignore

            socket.emit("error", new Error("timeout"));
          }, timeout);
          if (this.opts.autoUnref) {
            timer.unref();
          }
          this.subs.push(function subDestroy() {
            clearTimeout(timer);
          });
        }
        this.subs.push(openSubDestroy);
        this.subs.push(errorSub);
        return this;
      }
      /**
       * Alias for open()
       *
       * @return self
       * @public
       */
    }, {
      key: "connect",
      value: function connect(fn) {
        return this.open(fn);
      }
      /**
       * Called upon transport open.
       *
       * @private
       */
    }, {
      key: "onopen",
      value: function onopen() {
        // clear old subs
        this.cleanup(); // mark as open

        this._readyState = "open";
        this.emitReserved("open"); // add new subs

        var socket = this.engine;
        this.subs.push(on(socket, "ping", this.onping.bind(this)), on(socket, "data", this.ondata.bind(this)), on(socket, "error", this.onerror.bind(this)), on(socket, "close", this.onclose.bind(this)), on(this.decoder, "decoded", this.ondecoded.bind(this)));
      }
      /**
       * Called upon a ping.
       *
       * @private
       */
    }, {
      key: "onping",
      value: function onping() {
        this.emitReserved("ping");
      }
      /**
       * Called with data.
       *
       * @private
       */
    }, {
      key: "ondata",
      value: function ondata(data) {
        try {
          this.decoder.add(data);
        } catch (e) {
          this.onclose("parse error", e);
        }
      }
      /**
       * Called when parser fully decodes a packet.
       *
       * @private
       */
    }, {
      key: "ondecoded",
      value: function ondecoded(packet) {
        var _this3 = this;

        // the nextTick call prevents an exception in a user-provided event listener from triggering a disconnection due to a "parse error"
        nextTick(function () {
          _this3.emitReserved("packet", packet);
        }, this.setTimeoutFn);
      }
      /**
       * Called upon socket error.
       *
       * @private
       */
    }, {
      key: "onerror",
      value: function onerror(err) {
        this.emitReserved("error", err);
      }
      /**
       * Creates a new socket for the given `nsp`.
       *
       * @return {Socket}
       * @public
       */
    }, {
      key: "socket",
      value: function socket(nsp, opts) {
        var socket = this.nsps[nsp];
        if (!socket) {
          socket = new Socket(this, nsp, opts);
          this.nsps[nsp] = socket;
        }
        return socket;
      }
      /**
       * Called upon a socket close.
       *
       * @param socket
       * @private
       */
    }, {
      key: "_destroy",
      value: function _destroy(socket) {
        var nsps = Object.keys(this.nsps);
        for (var _i = 0, _nsps = nsps; _i < _nsps.length; _i++) {
          var nsp = _nsps[_i];
          var _socket = this.nsps[nsp];
          if (_socket.active) {
            return;
          }
        }
        this._close();
      }
      /**
       * Writes a packet.
       *
       * @param packet
       * @private
       */
    }, {
      key: "_packet",
      value: function _packet(packet) {
        var encodedPackets = this.encoder.encode(packet);
        for (var i = 0; i < encodedPackets.length; i++) {
          this.engine.write(encodedPackets[i], packet.options);
        }
      }
      /**
       * Clean up transport subscriptions and packet buffer.
       *
       * @private
       */
    }, {
      key: "cleanup",
      value: function cleanup() {
        this.subs.forEach(function (subDestroy) {
          return subDestroy();
        });
        this.subs.length = 0;
        this.decoder.destroy();
      }
      /**
       * Close the current socket.
       *
       * @private
       */
    }, {
      key: "_close",
      value: function _close() {
        this.skipReconnect = true;
        this._reconnecting = false;
        this.onclose("forced close");
        if (this.engine) this.engine.close();
      }
      /**
       * Alias for close()
       *
       * @private
       */
    }, {
      key: "disconnect",
      value: function disconnect() {
        return this._close();
      }
      /**
       * Called upon engine close.
       *
       * @private
       */
    }, {
      key: "onclose",
      value: function onclose(reason, description) {
        this.cleanup();
        this.backoff.reset();
        this._readyState = "closed";
        this.emitReserved("close", reason, description);
        if (this._reconnection && !this.skipReconnect) {
          this.reconnect();
        }
      }
      /**
       * Attempt a reconnection.
       *
       * @private
       */
    }, {
      key: "reconnect",
      value: function reconnect() {
        var _this4 = this;
        if (this._reconnecting || this.skipReconnect) return this;
        var self = this;
        if (this.backoff.attempts >= this._reconnectionAttempts) {
          this.backoff.reset();
          this.emitReserved("reconnect_failed");
          this._reconnecting = false;
        } else {
          var delay = this.backoff.duration();
          this._reconnecting = true;
          var timer = this.setTimeoutFn(function () {
            if (self.skipReconnect) return;
            _this4.emitReserved("reconnect_attempt", self.backoff.attempts); // check again for the case socket closed in above events

            if (self.skipReconnect) return;
            self.open(function (err) {
              if (err) {
                self._reconnecting = false;
                self.reconnect();
                _this4.emitReserved("reconnect_error", err);
              } else {
                self.onreconnect();
              }
            });
          }, delay);
          if (this.opts.autoUnref) {
            timer.unref();
          }
          this.subs.push(function subDestroy() {
            clearTimeout(timer);
          });
        }
      }
      /**
       * Called upon successful reconnect.
       *
       * @private
       */
    }, {
      key: "onreconnect",
      value: function onreconnect() {
        var attempt = this.backoff.attempts;
        this._reconnecting = false;
        this.backoff.reset();
        this.emitReserved("reconnect", attempt);
      }
    }]);
    return Manager;
  }(Emitter);

  /**
   * Managers cache.
   */

  var cache = {};
  function lookup(uri, opts) {
    if (_typeof(uri) === "object") {
      opts = uri;
      uri = undefined;
    }
    opts = opts || {};
    var parsed = url(uri, opts.path || "/socket.io");
    var source = parsed.source;
    var id = parsed.id;
    var path = parsed.path;
    var sameNamespace = cache[id] && path in cache[id]["nsps"];
    var newConnection = opts.forceNew || opts["force new connection"] || false === opts.multiplex || sameNamespace;
    var io;
    if (newConnection) {
      io = new Manager(source, opts);
    } else {
      if (!cache[id]) {
        cache[id] = new Manager(source, opts);
      }
      io = cache[id];
    }
    if (parsed.query && !opts.query) {
      opts.query = parsed.queryKey;
    }
    return io.socket(parsed.path, opts);
  } // so that "lookup" can be used both as a function (e.g. `io(...)`) and as a
  // namespace (e.g. `io.connect(...)`), for backward compatibility

  _extends(lookup, {
    Manager: Manager,
    Socket: Socket,
    io: lookup,
    connect: lookup
  });
  return lookup;
});

},{}]},{},[6]);
