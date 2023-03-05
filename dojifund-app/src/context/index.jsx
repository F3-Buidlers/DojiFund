import React, { useContext, createContext } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../constants/contract'

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {

  const URI = "https://rpc.testnet.mantle.xyz"
  const jsonRPCProvider = new ethers.providers.JsonRpcProvider(URI);
  const ThirdFundContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, jsonRPCProvider)


  const getCampaigns = async () => {
    const campaigns = await ThirdFundContract.getCampaigns();
    const parsedCampaings = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i,
      video: campaign.video
    }));

    console.log("parsedCampaings")
    console.log(parsedCampaings)
    return parsedCampaings;
  }

  const getUserCampaigns = async (address) => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  }


  
  const getDonations = async (pId) => {
    const donations = await ThirdFundContract.getDonators( pId);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString())
      })
    }

    return parsedDonations;
  }


  return (
    <StateContext.Provider
      value={{
        getCampaigns,
        getUserCampaigns,
        getDonations
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);