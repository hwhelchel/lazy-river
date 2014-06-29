var Stream = require('../streams');
var expect = require('expect.js');

describe('Stream',function(){

  beforeEach(function(){
    var num = 1;
    this.head = num;
    this.tailValue = new Stream(2);
    var self = this;
    this.tail = function(){
      return self.tailValue;
    };
    this.stream = new Stream(this.head, this.tail);
    this.taillessStream = new Stream(this.head);
    this.headlessStream = new Stream();
  });

  describe('initialization', function(){
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
      it('has a tail', function(){
        expect(this.taillessStream).to.have.property('tailValue');
      });
    });
  });

  describe('#empty',function(){
    describe('with an empty stream', function(){
      it('returns true', function(){
        expect(this.headlessStream.empty()).to.be(true);
      });
    });

    describe('with a populated stream', function(){
      it('returns false', function(){
        expect(this.stream.empty()).to.be(false);
      });
    });
  });

  describe('#head',function(){
    it('returns the head value', function(){
      expect(this.stream.head()).to.be(this.head);
    });
  });

  describe('#tail',function(){
    it('returns the tail', function(){
      expect(this.stream.tail()).to.be(this.tailValue);
    });
  });

  describe('#delay',function(){
    it('returns a function',function(){
      expect(this.stream.delay(this.tail)).to.be.a(Function);
    });
  });

  describe('#memoTail',function(){
    it('returns a function', function(){
      expect(this.stream._memoTail(this.tail)).to.be.a(Function);
    });
  });

  describe('#force',function(){
    it('returns a stream',function(){
      expect(this.stream.force(this.stream.tailValue)).to.be.a(Stream);
    });
  });

  describe('#item',function(){
    it('returns the head of an element in the stream',function(){
      expect(this.stream.item(1)).to.be(this.tailValue.head());
    });
  });

  describe('#map',function(){
    beforeEach(function(){
      this.proc = function(value){
        return 2 * value;
      };
    });
    it('returns a stream',function(){
      expect(this.stream.map(this.proc)).to.be.a(Stream);
    });

    it('applies the proc to each value', function(){
      expect(this.stream.map(this.proc).head()).to.eql(this.proc(this.head));
    });
    describe('with an empty Stream', function(){
      it('returns a Stream',function(){
        expect(this.headlessStream.map(this.proc)).to.be.a(Stream);
      });

      it('that is empty', function(){
        expect(this.headlessStream.map(this.proc).empty()).to.be(true);
      });
    });
  });

  describe('#display',function(){
    it('returns nothing', function(){
      expect(this.stream.display()).to.be(undefined);
    });
  });

  describe('#range',function(){
    it('returns a stream',function(){
      expect(this.stream.range(2,3)).to.be.a(Stream);
    });

    it('is over the given range',function(){
      expect(this.stream.range(2,3).head()).to.be(2);
      expect(this.stream.range(2,3).tail().head()).to.be(3);
    });
    describe('low value greater than high value',function(){
      it('returns an empty Stream',function(){
        expect(this.stream.range(2,1).empty()).to.be(true);
      });
    });
  });

  describe('#member',function(){
    it('returns true if value is in stream',function(){
      expect(this.stream.member(1)).to.be(true);
    });

    it('returns false if a value is not in the stream',function(){
      expect(this.stream.member(1000)).to.be(false);
    });
  });

  describe('#filter',function(){
    beforeEach(function(){
      this.predicate = function(x){
        if (x !== 1) {
          return true;
        } else {
          return false;
        }
      };
    });
    it('returns a stream',function(){
      expect(this.stream.filter(this.predicate)).to.be.a(Stream);
    });

    it('filters by the given predicate',function(){
      expect(this.stream.filter(this.predicate).member(1)).to.be(false);
    });
  });

  describe('#sieve',function(){
    beforeEach(function(){
      Stream.integersStartingFrom = function(num) {
        return new Stream(num, function(){
          return Stream.integersStartingFrom(num += 1);
        });
      };
      this.primes = Stream.integersStartingFrom(2).sieve();
    });
    it('returns a stream',function(){
      expect(this.primes).to.be.a(Stream);
    });

    it('includes prime numbers',function(){
      expect(this.primes.member(3)).to.be(true);
    });
  });

  describe('#zip',function(){
    beforeEach(function(){
      this.zipProc = function(head1, head2){
        return head1 + head2;
      };
    });
    it('returns a Stream',function(){
      expect(this.stream.zip(this.zipProc, this.stream)).to.be.a(Stream);
    });
    it('applies the procedure to the heads of each stream',function(){
      expect(this.stream.zip(this.zipProc, this.stream).head()).to.be(2);
    });
    describe('an empty Stream',function(){
      it('returns the stream zipped on',function(){});
    });
    describe('zipped on Stream is empty',function(){
      it('returns the initial Stream',function(){});
    });
  });

  describe('#add',function(){
    it('returns a Stream',function(){
      expect(this.stream.add(this.stream)).to.be.a(Stream);
    });
    it('adds the heads of each stream together',function(){
      expect(this.stream.add(this.stream).head()).to.be(2);
    });
  });

  describe('#scale',function(){
    it('returns a stream',function(){
      expect(this.stream.scale(2)).to.be.a(Stream);
    });

    it('multiples the values by the scale',function(){
      expect(this.stream.scale(4).head()).to.be(4);
    });
  });
});