const hre = require("hardhat");
const { ethers } = require("hardhat");
const { assert, expect } = require("chai");
const snarkjs = require("snarkjs");

describe("verify circuit", () => {
    let circuit;
  
    const sampleInput = {
      hashes: ["963082509716077239700047271104641203631501012315053499257068829644149444065", "6569606350756371579934316469049763059398414715663062632860451253003219699291", "18412992945789084681766401324498118955879793924203637395439694875864532258268"],
      pub_keys: ["6", "8", "4"],
      msg: "77"
    };
    const sanityCheck = true;
  
    before(async () => {
      circuit = await hre.circuitTest.setup("verify");
    });
    
    describe('circuit tests', () => {
      
      it("produces a witness with valid constraints", async () => {
        console.log("made it");
        const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
        await circuit.checkConstraints(witness);
      });
    
      it("has the correct output", async () => {
        const expected = { attestation: 0 };
        const witness = await circuit.calculateWitness(sampleInput, sanityCheck);
        await circuit.assertOut(witness, expected);
      });
  
      it("fails if the input is wrong", async () => {
        await expect(circuit.calculateWitness({msg: 77, encryption_2: 3208624483780523041183675060771403739553915669308589732668944373630710187426}, sanityCheck)).to.be.rejectedWith(Error);
      });

      it("has expected witness values", async () => {
        const witness = await circuit.calculateLabeledWitness(sampleInput, sanityCheck);

        for (let i = 0; i < sampleInput.hashes.length; i++) {
          assert.propertyVal(witness, "main.hashes[" + i + "]", sampleInput.hashes[i]);
          assert.propertyVal(witness, "main.pub_keys[" + i + "]", sampleInput.pub_keys[i]);
        }
        assert.propertyVal(witness, "main.msg", sampleInput.msg);
        assert.propertyVal(witness, "main.attestation", "0");
      });
    })
  });