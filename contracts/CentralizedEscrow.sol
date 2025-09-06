// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CentralizedEscrow {
    enum Status { Pending, InTransit, Completed, Failed }
    
    struct Order {
        address producer;
        address supermarket;
        uint amount;
        string trackingId;
        Status status;
    }
    
    mapping(uint => Order) public orders;
    uint public nextOrderId = 1;
    address public admin; // Single wallet controls all
    
    event OrderCreated(uint orderId, address producer, address supermarket, string trackingId);
    event StatusUpdated(uint orderId, Status newStatus, string trackingId);
    
    constructor() {
        admin = msg.sender;
    }
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }
    
    function createOrder(
        address _producer,
        address _supermarket,
        uint _amount,
        string memory _trackingId
    ) public onlyAdmin returns (uint) {
        uint orderId = nextOrderId++;
        orders[orderId] = Order(_producer, _supermarket, _amount, _trackingId, Status.Pending);
        emit OrderCreated(orderId, _producer, _supermarket, _trackingId);
        return orderId;
    }
    
    function updateStatus(uint _orderId, Status _newStatus) public onlyAdmin {
        require(orders[_orderId].producer != address(0), "Order not found");
        orders[_orderId].status = _newStatus;
        emit StatusUpdated(_orderId, _newStatus, orders[_orderId].trackingId);
    }
}