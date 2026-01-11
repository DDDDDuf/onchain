#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any

class LiquiFlowAPITester:
    def __init__(self, base_url="https://chain-flow-viz.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_base = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name: str, method: str, endpoint: str, expected_status: int = 200, params: Dict = None, data: Dict = None) -> tuple:
        """Run a single API test"""
        url = f"{self.api_base}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            else:
                raise ValueError(f"Unsupported method: {method}")

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    'name': name,
                    'endpoint': endpoint,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'name': name,
                'endpoint': endpoint,
                'error': str(e)
            })
            return False, {}

    def test_root_endpoint(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "")

    def test_networks(self):
        """Test networks endpoint"""
        success, data = self.run_test("Networks", "GET", "networks")
        if success and isinstance(data, list):
            print(f"   Found {len(data)} networks")
            for network in data[:3]:  # Show first 3
                print(f"   - {network.get('name', 'Unknown')}: {network.get('symbol', 'N/A')}")
        return success, data

    def test_dashboard_stats(self):
        """Test dashboard stats endpoint"""
        success, data = self.run_test("Dashboard Stats", "GET", "dashboard/stats")
        if success:
            print(f"   Volume 24h: ${data.get('total_volume_24h', 0):,.2f}")
            print(f"   Transactions 24h: {data.get('total_transactions_24h', 0):,}")
            print(f"   Active Entities: {data.get('active_entities', 0):,}")
        return success, data

    def test_entities(self):
        """Test entities endpoint"""
        success, data = self.run_test("Entities", "GET", "entities", params={'limit': 5})
        if success and 'entities' in data:
            print(f"   Found {len(data['entities'])} entities")
            for entity in data['entities'][:2]:  # Show first 2
                print(f"   - {entity.get('label', 'Unknown')}: {entity.get('entity_type', 'N/A')} (${entity.get('total_balance_usd', 0):,.2f})")
        return success, data

    def test_entity_detail(self):
        """Test entity detail endpoint"""
        # First get an entity address
        success, entities_data = self.test_entities()
        if success and entities_data.get('entities'):
            address = entities_data['entities'][0]['address']
            success, data = self.run_test("Entity Detail", "GET", f"entities/{address}")
            if success:
                print(f"   Entity: {data.get('label', 'Unknown')} ({data.get('entity_type', 'N/A')})")
                print(f"   Balance: ${data.get('total_balance_usd', 0):,.2f}")
                print(f"   Counterparties: {len(data.get('top_counterparties', []))}")
            return success, data
        return False, {}

    def test_transactions(self):
        """Test transactions endpoint"""
        success, data = self.run_test("Transactions", "GET", "transactions", params={'limit': 5})
        if success and 'transactions' in data:
            print(f"   Found {len(data['transactions'])} transactions")
            for tx in data['transactions'][:2]:  # Show first 2
                print(f"   - {tx.get('hash', 'Unknown')[:10]}...: ${tx.get('usd_value', 0):,.2f} ({tx.get('status', 'N/A')})")
        return success, data

    def test_transaction_detail(self):
        """Test transaction detail endpoint"""
        # First get a transaction hash
        success, tx_data = self.test_transactions()
        if success and tx_data.get('transactions'):
            tx_hash = tx_data['transactions'][0]['hash']
            success, data = self.run_test("Transaction Detail", "GET", f"transactions/{tx_hash}")
            if success:
                print(f"   Transaction: {data.get('hash', 'Unknown')[:10]}...")
                print(f"   Value: ${data.get('usd_value', 0):,.2f}")
                print(f"   Internal TXs: {len(data.get('internal_txs', []))}")
            return success, data
        return False, {}

    def test_pools(self):
        """Test pools endpoint"""
        success, data = self.run_test("Pools", "GET", "pools", params={'limit': 5})
        if success and 'pools' in data:
            print(f"   Found {len(data['pools'])} pools")
            for pool in data['pools'][:2]:  # Show first 2
                print(f"   - {pool.get('name', 'Unknown')}: ${pool.get('total_liquidity_usd', 0):,.2f} ({pool.get('protocol', 'N/A')})")
        return success, data

    def test_pool_detail(self):
        """Test pool detail endpoint"""
        # First get a pool address
        success, pools_data = self.test_pools()
        if success and pools_data.get('pools'):
            address = pools_data['pools'][0]['address']
            success, data = self.run_test("Pool Detail", "GET", f"pools/{address}")
            if success:
                print(f"   Pool: {data.get('name', 'Unknown')} ({data.get('protocol', 'N/A')})")
                print(f"   Liquidity: ${data.get('total_liquidity_usd', 0):,.2f}")
                print(f"   LP Holders: {len(data.get('top_lp_holders', []))}")
                print(f"   Recent Events: {len(data.get('recent_events', []))}")
            return success, data
        return False, {}

    def test_alerts(self):
        """Test alerts endpoint"""
        success, data = self.run_test("Alerts", "GET", "alerts", params={'limit': 5})
        if success and 'alerts' in data:
            print(f"   Found {len(data['alerts'])} alerts")
            for alert in data['alerts'][:2]:  # Show first 2
                print(f"   - {alert.get('title', 'Unknown')}: {alert.get('severity', 'N/A')} (${alert.get('usd_value', 0):,.2f})")
        return success, data

    def test_flow_graph(self):
        """Test flow graph endpoint"""
        success, data = self.run_test("Flow Graph", "GET", "flow-graph", params={'limit': 10})
        if success:
            nodes = data.get('nodes', [])
            links = data.get('links', [])
            print(f"   Nodes: {len(nodes)}, Links: {len(links)}")
            if nodes:
                print(f"   Sample node: {nodes[0].get('label', 'Unknown')} ({nodes[0].get('entity_type', 'N/A')})")
        return success, data

    def test_search(self):
        """Test search endpoint"""
        success, data = self.run_test("Search", "GET", "search", params={'q': 'binance', 'limit': 5})
        if success:
            entities = data.get('entities', [])
            print(f"   Found {len(entities)} entities matching 'binance'")
            if entities:
                print(f"   Sample result: {entities[0].get('label', 'Unknown')} ({entities[0].get('entity_type', 'N/A')})")
        return success, data

    def test_price_history(self):
        """Test price history endpoint"""
        success, data = self.run_test("Price History", "GET", "price-history/ETH", params={'period': '7d'})
        if success:
            data_points = data.get('data', [])
            print(f"   Found {len(data_points)} price data points for ETH")
            if data_points:
                print(f"   Latest price: ${data_points[-1].get('price', 0):,.2f}")
        return success, data

    def test_filters_and_params(self):
        """Test various filter parameters"""
        print("\n🔍 Testing Filter Parameters...")
        
        # Test network filters
        networks = ['ethereum', 'bsc', 'polygon', 'arbitrum']
        for network in networks:
            success, _ = self.run_test(f"Entities - {network}", "GET", "entities", 
                                     params={'network': network, 'limit': 3})
            if not success:
                break
        
        # Test entity type filters
        entity_types = ['exchange', 'wallet', 'contract']
        for entity_type in entity_types:
            success, _ = self.run_test(f"Entities - {entity_type}", "GET", "entities", 
                                     params={'entity_type': entity_type, 'limit': 3})
            if not success:
                break
        
        # Test transaction type filters
        tx_types = ['transfer', 'swap', 'mint']
        for tx_type in tx_types:
            success, _ = self.run_test(f"Transactions - {tx_type}", "GET", "transactions", 
                                     params={'tx_type': tx_type, 'limit': 3})
            if not success:
                break
        
        # Test alert severity filters
        severities = ['critical', 'important', 'normal']
        for severity in severities:
            success, _ = self.run_test(f"Alerts - {severity}", "GET", "alerts", 
                                     params={'severity': severity, 'limit': 3})
            if not success:
                break

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting LiquiFlow API Tests")
        print(f"📍 Base URL: {self.base_url}")
        print("=" * 60)

        # Core API tests
        self.test_root_endpoint()
        self.test_networks()
        self.test_dashboard_stats()
        self.test_entities()
        self.test_entity_detail()
        self.test_transactions()
        self.test_transaction_detail()
        self.test_pools()
        self.test_pool_detail()
        self.test_alerts()
        self.test_flow_graph()
        self.test_search()
        self.test_price_history()
        
        # Filter tests
        self.test_filters_and_params()

        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.failed_tests:
            print(f"\n❌ Failed Tests ({len(self.failed_tests)}):")
            for test in self.failed_tests:
                print(f"   - {test['name']}: {test.get('error', f\"Status {test.get('actual', 'N/A')}\"")}")
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"\n🎯 Success Rate: {success_rate:.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    """Main test function"""
    tester = LiquiFlowAPITester()
    
    try:
        success = tester.run_all_tests()
        return 0 if success else 1
    except KeyboardInterrupt:
        print("\n\n⚠️  Tests interrupted by user")
        return 1
    except Exception as e:
        print(f"\n\n💥 Unexpected error: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())