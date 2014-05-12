// streams

function Stream(head, tail) {
      if ( typeof head !== 'undefined' ) {
          this.headValue = head;
      }
      if ( typeof tail === 'undefined' ) {
          tail = function () {
              return new Stream();
          };
      }
      this.tail = this.delay(tail);
  }

Stream.prototype = {
  empty: function() {
    return typeof this.headValue == 'undefined';
  },
  head: function(){
    return this.headValue;
  },

  tail: function(){
    return this.tail();
  },

  item: function(n) {
    var stream = this;
    while ( n !== 0 ) {
      --n;
      stream = stream.tail();
    }
    return stream.head();
  },

  delay: function(tail) {
    return this._memoTail(tail);
  },

  _memoTail: function(tail){
    var hasRun = false;
    var result;
    return function(){
      if(!hasRun) {
        result = tail();
        hasRun = true;
        return result;
      } else {
        return result;
      }
    };
  },

  length: function(){
    var stream = this;
    var length = 0;
    while (!stream.empty()){
      ++length;
      stream = stream.tail();
    }
    return length;
  },

  add: function(stream){
    return this.zip(function(x, y){
      return x + y;
    }, stream);
  },

  append: function(stream){
    if (this.empty()){
      return stream;
    }
    var that = this;
    return new Stream(
      that.head(),
      function(){
        return that.tail().append(stream);
      }
    );
  },

  zip: function(fn, stream){
    if ( this.empty() ){
      return stream;
    }
    if ( stream.empty() ){
      return this;
    }
    var that = this;
    return new Stream( fn(stream.head(), this.head()),
      function(){
        return that.tail().zip(fn, stream.tail());
      });
  },

  map: function(fn){
    if (this.empty()) {
      return this;
    }
    var that = this;
    return new Stream ( fn(this.head()), function(){
      return that.tail().map(fn);
    });
  },

  force: function(){
    var stream = this;
    while ( !stream.empty() ){
      stream = stream.tail();
    }
  },

  scale: function( factor ){
    return this.map(function(x){
      return factor * x;
    });
  }
};