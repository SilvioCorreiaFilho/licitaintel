import { toast } from "sonner";
import { bidService, monitoringService, priceHistoryService } from "./databaseService";

/**
 * Utility to test API connections and database operations
 */
export const apiTester = {
  /**
   * Test the bid service
   */
  testBidService: async () => {
    try {
      console.log("Testing bid service...");
      const bids = await bidService.getBids({ limit: 5 });
      console.log(`Retrieved ${bids.length} bids`);
      console.log("Sample bid:", bids[0]);
      
      if (bids.length > 0) {
        const bid = await bidService.getBidById(bids[0].id);
        console.log("Retrieved single bid:", bid);
      }
      
      // Test semantic search if bids exist
      if (bids.length > 0) {
        const results = await bidService.searchBidsSemantic("computador", 3);
        console.log(`Found ${results.length} semantic results`);
        console.log("Semantic results:", results);
        
        const similarBids = await bidService.getSimilarBids(bids[0].id, 3);
        console.log(`Found ${similarBids.similar_bids?.length || 0} similar bids`);
        console.log("Similar bids:", similarBids);
      }
      
      toast.success("Bid service tests completed successfully");
      return true;
    } catch (error) {
      console.error("Error testing bid service:", error);
      toast.error(`Bid service test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  },
  
  /**
   * Test the monitoring service
   */
  testMonitoringService: async () => {
    try {
      console.log("Testing monitoring service...");
      const monitorings = await monitoringService.getMonitorings();
      console.log(`Retrieved ${monitorings.length} monitorings`);
      if (monitorings.length > 0) {
        console.log("Sample monitoring:", monitorings[0]);
      }
      
      toast.success("Monitoring service tests completed successfully");
      return true;
    } catch (error) {
      console.error("Error testing monitoring service:", error);
      toast.error(`Monitoring service test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  },
  
  /**
   * Test the price history service
   */
  testPriceHistoryService: async () => {
    try {
      console.log("Testing price history service...");
      const priceHistory = await priceHistoryService.getPriceHistory("TI-PC-001");
      console.log(`Retrieved ${priceHistory.length} price history records`);
      if (priceHistory.length > 0) {
        console.log("Sample price history:", priceHistory[0]);
      }
      
      const projection = await priceHistoryService.getPriceProjection("TI-PC-001", "compra anual saúde");
      console.log("Price projection:", projection);
      
      toast.success("Price history service tests completed successfully");
      return true;
    } catch (error) {
      console.error("Error testing price history service:", error);
      toast.error(`Price history service test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  },
  
  /**
   * Run all tests
   */
  runAllTests: async () => {
    const bidTest = await apiTester.testBidService();
    const monitoringTest = await apiTester.testMonitoringService();
    const priceHistoryTest = await apiTester.testPriceHistoryService();
    
    return {
      bidTest,
      monitoringTest,
      priceHistoryTest,
      allPassed: bidTest && monitoringTest && priceHistoryTest
    };
  }
};
