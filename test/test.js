var Stream = require('../streams');
var expect = require('expect.js');

describe('Stream',function(){

  beforeEach(function(){
    var num = 1;
    this.stream = new Stream(num, function(){
      return new Stream(num += 1);
    });
    this.taillessStream = new Stream(num);
    this.headlessStream = new Stream();
  });

  describe('.new', function(){
    it('has a head', function(){
      expect(this.stream).to.have.property('headValue');
    });
    it('has a tail',function(){
      expect(this.stream).to.have.property('tailValue');
    });
    it('returns a Stream', function(){
      expect(this.stream).to.be.a(Stream);
    });
    describe('with tail undefined', function(){
      it('initializes default Stream for tail', function(){
        expect(this.taillessStream.tail)
      });
    });
  });

  describe('#empty',function(){
    describe('with an empty stream', function(){
      it('returns true', function(){
      });
    });

    describe('with a populated stream', function(){
      it('returns false', function(){
      });
    });
  });

  describe('#head',function(){
    it('message', function(){
    });
  });

  describe('#tail',function(){
    it('message', function(){
    });
  });

  describe('#delay',function(){
    it('message', function(){
    });
  });

  describe('#memoTail',function(){
    it('message', function(){
    });
  });

  describe('#force',function(){
    it('message', function(){
    });
  });

  describe('#item',function(){
    it('message', function(){
    });
  });

  describe('#map',function(){
    it('message', function(){
    });
  });

  describe('#each',function(){
    it('message', function(){
    });
  });

  describe('#display',function(){
    it('message', function(){
    });
  });

  describe('#range',function(){
    it('message', function(){
    });
  });

  describe('#filter',function(){
    it('message', function(){
    });
  });

  describe('#sieve',function(){
    it('message', function(){
    });
  });

  describe('#zip',function(){
    it('message', function(){
    });
  });

  describe('#add',function(){
    it('message', function(){
    });
  });

  describe('#scale',function(){
    it('message', function(){
    });
  });

  describe('#interleave',function(){
    it('message', function(){
    });
  });


});