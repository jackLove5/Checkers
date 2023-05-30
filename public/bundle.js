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
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
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
var CheckersGame = /*#__PURE__*/_createClass(function CheckersGame() {
  var _this = this;
  _classCallCheck(this, CheckersGame);
  this.turn = CheckersGame.PLAYER_BLACK;
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
  var notationToCoords = function notationToCoords(num) {
    num = parseInt(num);
    if (typeof num !== 'number' || Number.isNaN(num) || num > 32 || num < 1) {
      return undefined;
    }
    var row = Math.floor((num - 1) / 4);
    var col = row % 2 === 0 ? 1 + (num - 1) % 4 * 2 : (num - 1) % 4 * 2;
    return [row, col];
  };
  var coordsToNotation = function coordsToNotation(row, col) {
    if (row < 0 || row >= 8 || col < 0 || col >= 8 || row % 2 === col % 2) {
      return undefined;
    }
    return row * 4 + Math.floor(col / 2) + 1;
  };
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
        return jumpMove.origin == pos;
      });
    }
    var possibleMoves = [];
    var movingPiece = board[pos];
    if (!movingPiece || movingPiece.color != _this.turn) {
      return [];
    }
    var yDirections = [];
    var xDirections = [-1, 1];
    if (movingPiece.color === CheckersGame.PLAYER_BLACK || movingPiece.isKing) {
      yDirections.push(1);
    }
    if (movingPiece.color === CheckersGame.PLAYER_WHITE || movingPiece.isKing) {
      yDirections.push(-1);
    }
    if (notationToCoords(pos) === undefined) {
      throw "Invalid piece position ".concat(pos);
    }
    var _notationToCoords = notationToCoords(pos),
      _notationToCoords2 = _slicedToArray(_notationToCoords, 2),
      row = _notationToCoords2[0],
      col = _notationToCoords2[1];
    for (var _i2 = 0, _yDirections = yDirections; _i2 < _yDirections.length; _i2++) {
      var dy = _yDirections[_i2];
      var _iterator = _createForOfIteratorHelper(xDirections),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var dx = _step.value;
          var dst = coordsToNotation(row + dy, col + dx);
          if (dst && !board[dst]) {
            possibleMoves.push({
              origin: pos,
              dst: dst,
              shortNotation: "".concat(pos, "-").concat(dst),
              longNotation: "".concat(pos, "-").concat(dst),
              capturedPieces: []
            });
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
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
  var getSingleJumpsByPos = function getSingleJumpsByPos(pos) {
    var _notationToCoords3 = notationToCoords(pos),
      _notationToCoords4 = _slicedToArray(_notationToCoords3, 2),
      row = _notationToCoords4[0],
      col = _notationToCoords4[1];
    var jumpMoves = [];
    if (board[pos] && board[pos].color === _this.turn) {
      var xDirections = [1, -1];
      var yDirections = [];
      if (board[pos].color === CheckersGame.PLAYER_BLACK || board[pos].isKing) {
        yDirections.push(1);
      }
      if (board[pos].color === CheckersGame.PLAYER_WHITE || board[pos].isKing) {
        yDirections.push(-1);
      }
      for (var _i3 = 0, _yDirections2 = yDirections; _i3 < _yDirections2.length; _i3++) {
        var dy = _yDirections2[_i3];
        var _iterator2 = _createForOfIteratorHelper(xDirections),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var dx = _step2.value;
            var dst = coordsToNotation(row + dy * 2, col + dx * 2);
            var capturedPiece = coordsToNotation(row + dy, col + dx);
            if (dst && capturedPiece && !board[dst] && board[capturedPiece] && board[capturedPiece].color !== board[pos].color) {
              jumpMoves.push({
                origin: pos,
                dst: dst,
                shortNotation: "".concat(pos, "x").concat(dst),
                longNotation: "".concat(pos, "x").concat(dst),
                capturedPieces: [coordsToNotation(row + dy, col + dx)]
              });
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    }
    return jumpMoves;
  };
  var getJumpMovesByPos = function getJumpMovesByPos(pos) {
    if (!notationToCoords(pos)) {
      return [];
    }
    var singleJumps = getSingleJumpsByPos(pos);
    var jumpMoves = [];
    singleJumps.forEach(function (jumpMove) {
      var origin = jumpMove.origin,
        dst = jumpMove.dst,
        capturedPieces = jumpMove.capturedPieces;
      var jumpingPiece = board[origin];
      var capturedPiece = board[capturedPieces[0]];
      board[capturedPieces[0]] = null;
      board[dst] = jumpingPiece;
      board[origin] = null;
      var subJumps = getJumpMovesByPos(dst);
      board[dst] = null;
      board[origin] = jumpingPiece;
      board[capturedPieces[0]] = capturedPiece;
      if (subJumps.length > 0) {
        subJumps.forEach(function (subJump) {
          jumpMoves.push({
            origin: origin,
            dst: subJump.dst,
            shortNotation: "".concat(origin, "x").concat(subJump.dst),
            longNotation: "".concat(origin, "x").concat(subJump.longNotation),
            capturedPieces: capturedPieces.concat(subJump.capturedPieces)
          });
        });
      } else {
        jumpMoves.push(jumpMove);
      }
    });
    return jumpMoves;
  };
  this.getPlayableMovesByPosition = function (pos) {
    return getPlayableMovesByPos(pos);
  };
  this.getPlayableMoves = function () {
    var res = [];
    for (var _i4 = 1; _i4 <= 32; _i4++) {
      res = res.concat(getPlayableMovesByPos(_i4));
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
    for (var _i5 = 1; _i5 <= 32; _i5++) {
      board[_i5] = null;
    }
    var _fen$split = fen.split(':'),
      _fen$split2 = _slicedToArray(_fen$split, 3),
      turn = _fen$split2[0],
      p1Pieces = _fen$split2[1],
      p2Pieces = _fen$split2[2];
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
      if (!piece) {
        return;
      }
      var isKing = piece.charAt(0) == 'k';
      if (isKing) {
        piece = piece.substring(1);
      }
      var pos = parseInt(piece);
      if (Number.isNaN(pos)) {
        throw "Invalid FEN format. ".concat(fen);
      }
      board[pos] = new Piece(color);
      board[pos].isKing = isKing;
    });
    _this.turn = turn.toLowerCase() == 'b' ? CheckersGame.PLAYER_BLACK : CheckersGame.PLAYER_WHITE;
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
});
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
var _challenge = require("./challenge");
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var CheckersBoard = require('./CheckersBoard');
var socket = io.connect("/", {
  withCredentials: true
});
(0, _challenge.registerChallengeHandlers)(socket);
if (window.Cypress) {
  window.socketHandlers = _challenge.challengeSocketHandlers;
  window.emittedEvents = _challenge.emittedEvents;
}
window.addEventListener('load', function (e) {
  var mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  var nav = document.querySelector('nav');
  mobileNavToggle.addEventListener('click', function () {
    nav.toggleAttribute('data-visible');
    mobileNavToggle.setAttribute('aria-expanded', nav.hasAttribute('data-visible'));
  });
  var playAgainstFriendButton = document.getElementById('play-friend');
  playAgainstFriendButton.onclick = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(e) {
      var resp, json;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fetch('/api/game/create', {
              method: 'POST',
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                vsCpu: false
              })
            });
          case 2:
            resp = _context.sent;
            _context.next = 5;
            return resp.json();
          case 5:
            json = _context.sent;
            window.location = "/play/game/".concat(json._id);
          case 7:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();
  var playAgainstCompButton = document.getElementById('play-comp');
  playAgainstCompButton.onclick = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(e) {
      var resp, json;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return fetch('/api/game/create', {
              method: 'POST',
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                vsCpu: true
              })
            });
          case 2:
            resp = _context2.sent;
            _context2.next = 5;
            return resp.json();
          case 5:
            json = _context2.sent;
            window.location = "/play/game/".concat(json._id);
          case 7:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }();
  document.getElementById('checkers-board').lockBoard();
});

},{"./CheckersBoard":2,"./challenge":5}]},{},[6]);
