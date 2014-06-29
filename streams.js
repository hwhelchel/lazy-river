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
    this.tailValue = this.delay(tail);
  }

Stream.prototype = {
  empty: function() {
    return typeof this.head() === 'undefined';
  },

  head: function(){
    return this.headValue;
  },

  tail: function(){
    return this.force(this.tailValue);
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

  force: function(delayedTail){
    return delayedTail();
  },

  item: function(element) {
    if (element === 0){
      return this.head();
    } else {
      return this.tail().item(element - 1);
    }
  },

  map: function(proc){
    if (this.empty()){
      return new Stream();
    } else {
      var self = this;
      return new Stream(proc(this.head()), function() {
        return self.tail().map(proc);
      });
    }
  },

  each: function(proc){
    if (this.empty()){
      return 'done';
    } else {
      proc(this.head());
      this.tail().each(proc);
    }
  },

  display: function(){
    this.each(function(value){
      console.log(value);
    });
  },

  range: function(low, high) {
    if (low > high) {
      return new Stream();
    } else {
      var self = this;
      return new Stream(low, function() {
        return self.range(low + 1, high);
      });
    }
  },

  filter: function(predicate){
    var self = this;
    if (self.empty()){
      return new Stream();
    } else if (predicate(self.head())) {
      return new Stream(self.head(), function() {
        return self.tail().filter(predicate);
      });
    } else {
      return self.tail().filter(predicate);
    }
  },

  member: function(x){
    var self = this;

    while(!self.empty()) {
      if (self.head() == x) {
          return true;
      }
      self = self.tail();
    }

    return false;
  },

  sieve: function() {
    var willDivide = function(a, b){
      return b % a === 0;
    };
    var self = this;
    return new Stream(self.head(), function() {
      return self.tail().filter(function(num) {
        return !willDivide(self.head(), num);
        }).sieve();
    });
  },

  zip: function(proc, stream) {
    if (this.empty()) {
      return stream;
    } else if (stream.empty()) {
      return this;
    }
    var self = this;
    return new Stream(proc(self.head(),stream.head()), function() {
      return self.tail().zip(proc, stream.tail());
    });
  },

  add: function(stream) {
    return this.zip(function(value1, value2) {
      return value1 + value2;
    }, stream);
  },

  scale: function(factor){
    return this.map(function(head){
      return head * factor;
    });
  }
};

if (typeof module !== 'undefined') {
  module.exports = Stream;
}
