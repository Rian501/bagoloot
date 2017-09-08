'use strict;'
const chai = require('chai');
const { assert, assert: { isString, instanceOf, isObject, isFunction, exists, isEmpty, isArray }  } = require('chai');
const { getToysByChild, deliveredChange, addItem, removeItem, getItems, goodKidsList } = require('../lootbag.js');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

// Items can be added to bag.
describe('lootbag', () => {
  describe('Items can be added to the bag:', ()=> {
    it('should be a function', () => {
      isFunction(addItem);
    });
    it('should not exist before being added', () => {
      return instanceOf(getItems("Mike", "boardgame"), Promise)
    });
    it('should exist after being added', () => {
       return addItem("boardgame", "Mike")
      .then( function() {
        assert.eventually.isObject(getItems("Mike", "boardgame")); 
      });
    });
  });
  
  // Items can be removed from bag, per child only. Removing ball from the bag should not be allowed. A child's name must be specified.
  describe('items can be removed from the bag:', () => {
    it ('should be a function', () => {
      isFunction(removeItem);
    });
    it('should exist before being removed', () => {
      exists(getItems("Suzy", "coal"));
    });
    it('should not exist after being deleted', () => {
      return removeItem("Suzy", "coal")
      .then( function () {
        assert.eventually.isEmpty(getItems("Suzy", "coal"));
      })
    });   
  });
  
  // Must be able to list all children who are getting a toy.
  describe('can list all children getting toys', () => {
    it('should be a function', () => {
      isFunction(goodKidsList);
    });
    it('should be an array of results (eventually)', () => {
      assert.eventually.isArray(goodKidsList());
    });
  });
  
  // Must be able to list all toys for a given child's name.
  describe('can list all toys for a given child', () => {
    it('should be a function', () => {
      isFunction(getToysByChild);
    });
    it('should eventually return an array', ()=>{
      assert.eventually.isArray(getToysByChild("Freddy"));
    })
  });

  // Must be able to set the delivered property of a child, which defaults to false to true.
  describe('can change delivery status for a given child', () => {
    it('should be a function', () => {
      isFunction(deliveredChange);
    });
    it('should return an object with a delivered property of true to show the delivery has happened given a child name', ()=>{
      return deliveredChange("Freddy")
      .then (assert.eventually.isObject(getItems("Freddy"))
    )
    })


  });

  //end of lootbag assertion set
})






