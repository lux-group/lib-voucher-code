import assert from "assert";
import * as voucherCode from "../src";

describe("voucher code", function() {
  it("should generate code of request length", function() {
    const length = 5;
    const code = voucherCode.generate({ length: length })[0];

    assert.equal(code.length, length);
  });

  it("should generate code of default length", function() {
    const defaultLength = 8;
    const code = voucherCode.generate({})[0];

    assert.equal(code.length, defaultLength);
  });

  it("should generate code if no config provided", function() {
    const defaultLength = 8;
    const code = voucherCode.generate()[0];

    assert.equal(code.length, defaultLength);
  });

  it("should generate 5 unique codes", function() {
    const codes = voucherCode.generate({
      length: 2,
      count: 5
    });

    assert.equal(codes.length, 5);
    codes.forEach(function(code) {
      assert.equal(code.length, 2);
      assert.equal(codes.indexOf(code), codes.lastIndexOf(code)); // check uniqueness
    });
  });

  it("should generate a code consisting of numbers only", function() {
    const numbers = "0123456789";
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const code = voucherCode.generate({
      length: 10,
      charset: numbers
    })[0];

    assert.equal(code.length, 10);
    code.split("").forEach(function(char) {
      assert(numbers.match(char));
      assert(!letters.match(char));
    });
  });

  it("should generate a code consisting of letters only", function() {
    const numbers = "0123456789";
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const code = voucherCode.generate({
      length: 10,
      charset: letters
    })[0];

    assert.equal(code.length, 10);
    code.split("").forEach(function(char) {
      assert(letters.match(char));
      assert(!numbers.match(char));
    });
  });

  it("should generate code with prefix", function() {
    const code = voucherCode.generate({
      prefix: "promo-"
    })[0];

    assert(code.match(/^promo-/));
  });

  it("should generate code with postfix", function() {
    const code = voucherCode.generate({
      postfix: "-extra"
    })[0];

    assert(code.match(/-extra$/));
  });

  it("should generate code with prefix and postfix", function() {
    const code = voucherCode.generate({
      prefix: "promo-",
      postfix: "-extra"
    })[0];

    assert(code.match(/^promo-.*-extra$/));
  });

  it("should generate code from pattern", function() {
    const code = voucherCode.generate({
      pattern: "##-###-##"
    })[0];

    assert(code.match(/^([0-9a-zA-Z]){2}-([0-9a-zA-Z]){3}-([0-9a-zA-Z]){2}$/));
  });

  it("should detect infeasible config", function() {
    const config = {
      count: 1000,
      charset: "abc",
      length: 5
    }; // there are only 125 (5^3) possible codes for this config

    assert.throws(
      () => voucherCode.generate(config),
      /Not possible to generate requested number of codes./
    );
  });

  it("should generate fixed code", function() {
    const config = {
      count: 1,
      pattern: "FIXED"
    };

    const codes = voucherCode.generate(config);

    assert.equal(codes.length, 1);
    assert.equal(codes[0], "FIXED");
  });
});
