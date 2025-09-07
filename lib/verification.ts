/**
 * Verification utilities for World ID ORB verification
 */

import { getIsUserVerified } from "@worldcoin/minikit-js"

// Test wallet address that's allowed without ORB verification
const TEST_WALLET_ADDRESS = "0x948c3dc6a9ed728f010d1f163d45de4a3415b53a"

/**
 * Check if a wallet address is ORB verified using the official MiniKit getIsUserVerified function
 */
export async function checkOrbVerification(address: string): Promise<boolean> {
  try {
    // Allow test wallet address without verification for testing
    if (address.toLowerCase() === TEST_WALLET_ADDRESS.toLowerCase()) {
      console.log(`Test wallet ${address} allowed without ORB verification`)
      return true
    }

    // Use the official MiniKit function to check ORB verification
    console.log(`Checking ORB verification for ${address} using MiniKit getIsUserVerified()`)
    const isVerified = await getIsUserVerified(address)
    
    console.log(`ORB verification result for ${address}: ${isVerified}`)
    return isVerified
    
  } catch (error) {
    console.error("Error checking ORB verification:", error)
    return false
  }
}

/**
 * Check if a user is allowed to use the app based on verification status
 */
export function isUserAllowed(address: string, isOrbVerified: boolean): boolean {
  // Always allow test wallet
  if (address.toLowerCase() === TEST_WALLET_ADDRESS.toLowerCase()) {
    return true
  }
  
  // For production, require ORB verification
  return isOrbVerified
}

/**
 * Get verification status message for UI
 */
export function getVerificationMessage(address: string, isOrbVerified: boolean): string {
  if (address.toLowerCase() === TEST_WALLET_ADDRESS.toLowerCase()) {
    return "Test account - verification bypassed"
  }
  
  if (isOrbVerified) {
    return "ORB verified ✓"
  }
  
  return "ORB verification required. Please visit a World ID ORB location to verify your identity."
}
