// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DeliveryEscrow {
    enum Status {
        Pending,
        InTransit,
        Completed,
        Failed
    }
    Status public status;

    address public producer;
    address public supermarket;

    uint public amount;
    string public trackingId;

    event StatusUpdated(Status newStatus, string trackingId);
    event EscrowCreated(
        address producer,
        address supermarket,
        uint amount,
        string trackingId
    );

    constructor(
        address _producer,
        address _supermarket,
        uint _amount,
        string memory _trackingId
    ) {
        producer = _producer;
        supermarket = _supermarket;
        amount = _amount;
        trackingId = _trackingId;
        status = Status.Pending;

        emit EscrowCreated(_producer, _supermarket, _amount, _trackingId);
    }

    function markShipped() public {
        require(msg.sender == producer, "Only producer");
        require(status == Status.Pending, "Already shipped or completed");
        status = Status.InTransit;
        emit StatusUpdated(status, trackingId);
    }

    function confirmDelivery() public {
        require(msg.sender == supermarket, "Only supermarket");
        require(status == Status.InTransit, "Not in transit");
        status = Status.Completed;
        emit StatusUpdated(status, trackingId);
    }

    function markFailed() public {
        require(msg.sender == supermarket, "Only supermarket can cancel");
        require(
            status == Status.Pending || status == Status.InTransit,
            "Invalid state"
        );
        status = Status.Failed;
        emit StatusUpdated(status, trackingId);
    }
}
