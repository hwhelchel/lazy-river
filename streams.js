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

  force: function(){
    var stream = this;
    while ( !stream.empty() ){
      stream = stream.tail();
    }
  }
};