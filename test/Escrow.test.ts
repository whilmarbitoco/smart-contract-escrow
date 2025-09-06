import { expect } from "chai";
import { ethers } from "hardhat";
import { DeliveryEscrow } from "../types";

describe("DeliveryEscrow", function () {
  let escrow: DeliveryEscrow;
  let producer: any;
  let supermarket: any;
  let other: any;

  beforeEach(async function () {
    [, producer, supermarket, other] = await ethers.getSigners();
    
    const DeliveryEscrow = await ethers.getContractFactory("DeliveryEscrow");
    escrow = await DeliveryEscrow.deploy(
      producer.address,
      supermarket.address,
      1000, // Order value reference (not ETH)
      "TEST123"
    );
    await escrow.waitForDeployment();
  });

  it("Should initialize with correct values", async function () {
    expect(await escrow.producer()).to.equal(producer.address);
    expect(await escrow.supermarket()).to.equal(supermarket.address);
    expect(await escrow.amount()).to.equal(1000);
    expect(await escrow.trackingId()).to.equal("TEST123");
    expect(await escrow.status()).to.equal(0); // Pending
  });

  it("Should allow producer to mark as shipped", async function () {
    await escrow.connect(producer).markShipped();
    expect(await escrow.status()).to.equal(1); // InTransit
  });

  it("Should allow supermarket to confirm delivery", async function () {
    await escrow.connect(producer).markShipped();
    await escrow.connect(supermarket).confirmDelivery();
    expect(await escrow.status()).to.equal(2); // Completed
  });

  it("Should allow supermarket to mark as failed", async function () {
    await escrow.connect(supermarket).markFailed();
    expect(await escrow.status()).to.equal(3); // Failed
  });

  it("Should reject unauthorized actions", async function () {
    await expect(
      escrow.connect(other).markShipped()
    ).to.be.revertedWith("Only producer");
    
    await expect(
      escrow.connect(other).confirmDelivery()
    ).to.be.revertedWith("Only supermarket");
  });
});