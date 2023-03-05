// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract ThirdFund {
    struct Project {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        string video;
        address[] donators;
        uint256[] donations;
    }

    event IProjectEvent(
        address owner,
        string title,
        string description,
        uint256 target,
        uint256 deadline,
        uint256 amountCollected
    );
    event IFunder(address owner, uint256 projectId, uint256 amount);

    mapping(uint256 => Project) public projects;

    uint256 public numberOfProjects = 0;

    function createProject(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image,
        string memory _video
    ) public returns (uint256) {
        Project storage project = projects[numberOfProjects];

        require(
            project.deadline < block.timestamp,
            "The deadline should be a date in the future."
        );

        project.owner = _owner;
        project.title = _title;
        project.description = _description;
        project.target = _target;
        project.deadline = _deadline;
        project.amountCollected = 0;
        project.image = _image;
        project.video = _video;

        numberOfProjects++;

        emit IProjectEvent(_owner, _title, _description, _target, _deadline, 0);
        return numberOfProjects - 1;
    }

    function donateToProject(uint256 _id) public payable {
        uint256 amount = msg.value;

        Project storage project = projects[_id];

        project.donators.push(msg.sender);
        project.donations.push(amount);

        (bool sent, ) = payable(project.owner).call{value: amount}("");

        if (sent) {
            project.amountCollected = project.amountCollected + amount;
        }
        emit IFunder(msg.sender, _id, msg.value);
    }

    function getDonators(uint256 _id)
        public
        view
        returns (address[] memory, uint256[] memory)
    {
        return (projects[_id].donators, projects[_id].donations);
    }

    function getCampaigns() public view returns (Project[] memory) {
        Project[] memory allProjects = new Project[](numberOfProjects);

        for (uint256 i = 0; i < numberOfProjects; i++) {
            Project storage item = projects[i];

            allProjects[i] = item;
        }

        return allProjects;
    }
}
