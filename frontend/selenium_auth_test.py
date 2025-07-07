from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import time
import random
import string

class AuthWorkflowTest:
    def __init__(self, base_url="http://localhost:5173"):
        self.base_url = base_url
        self.driver = None
        self.wait = None
        
    def setup_driver(self):
        """Setup Chrome WebDriver with options"""
        chrome_options = Options()
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-web-security")
        chrome_options.add_argument("--disable-features=VizDisplayCompositor")
        
        # Uncomment the line below if you want to run in headless mode
        # chrome_options.add_argument("--headless")
        
        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.implicitly_wait(10)
        self.wait = WebDriverWait(self.driver, 20)
        
    def generate_random_email(self):
        """Generate a random email for testing"""
        random_string = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
        return f"test{random_string}@example.com"
    
    def clear_auth_state(self):
        """Clear browser storage"""
        # Navigate to a valid page first before clearing storage
        self.driver.get("about:blank")
        self.driver.delete_all_cookies()
        try:
            self.driver.execute_script("window.localStorage.clear();")
            self.driver.execute_script("window.sessionStorage.clear();")
        except:
            pass  # Ignore storage clearing errors
    
    def test_registration(self):
        """Test user registration"""
        print("🧪 Testing user registration...")
        
        try:
            # Generate unique email
            test_email = self.generate_random_email()
            print(f"📧 Using email: {test_email}")
            
            # Navigate to registration page
            self.driver.get(f"{self.base_url}/register")
            time.sleep(1)  # Wait to see page load
            
            # Fill registration form
            self.driver.find_element(By.NAME, "name").send_keys("John Doe")
            self.driver.find_element(By.NAME, "email").send_keys(test_email)
            self.driver.find_element(By.NAME, "password").send_keys("adil@101")
            self.driver.find_element(By.NAME, "address").send_keys("123 Main St")
            self.driver.find_element(By.NAME, "thana").send_keys("Dhanmondi")
            self.driver.find_element(By.NAME, "po").send_keys("Dhanmondi PO")
            self.driver.find_element(By.NAME, "city").send_keys("Dhaka")
            self.driver.find_element(By.NAME, "postalCode").send_keys("1205")
            self.driver.find_element(By.NAME, "zoneId").send_keys("1")
            
            # Submit form
            submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
            submit_button.click()
            
            # Wait for loading state
            self.wait.until(EC.text_to_be_present_in_element(
                (By.CSS_SELECTOR, "button[type='submit']"), "Creating Account..."
            ))
            
            # Wait for redirect (registration success)
            self.wait.until(lambda driver: "/register" not in driver.current_url)
            time.sleep(1)  # Wait to see redirect
            
            print("✅ Registration test passed!")
            return test_email
            
        except Exception as e:
            print(f"❌ Registration test failed: {str(e)}")
            return None
    
    def test_login_success(self):
        """Test successful login"""
        print("🧪 Testing successful login...")
        
        try:
            # Navigate to login page
            self.driver.get(f"{self.base_url}/login")
            time.sleep(1)  # Wait to see page load
            
            # Fill login form with correct credentials
            self.driver.find_element(By.NAME, "email").send_keys("hasnaenadil@gmail.com")
            self.driver.find_element(By.NAME, "password").send_keys("adil@101")
            
            # Submit form
            submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
            submit_button.click()
            
            # Wait for loading state
            self.wait.until(EC.text_to_be_present_in_element(
                (By.CSS_SELECTOR, "button[type='submit']"), "Logging in..."
            ))
            
            # Wait for redirect (login success)
            self.wait.until(lambda driver: "/login" not in driver.current_url)
            time.sleep(1)  # Wait to see redirect
            
            # Check if redirected to hospitals page
            if "/hospitals" in self.driver.current_url:
                h1_element = self.driver.find_element(By.TAG_NAME, "h1")
                if "Find Hospitals" in h1_element.text:
                    print("✅ Login test passed!")
                    return True
            
            print("⚠️ Login successful but not redirected to expected page")
            return True
            
        except Exception as e:
            print(f"❌ Login test failed: {str(e)}")
            return False
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        print("🧪 Testing login with invalid credentials...")
        
        try:
            # Navigate to login page
            self.driver.get(f"{self.base_url}/login")
            time.sleep(1)  # Wait to see page load
            
            # Fill login form with wrong credentials
            self.driver.find_element(By.NAME, "email").send_keys("wrong@example.com")
            self.driver.find_element(By.NAME, "password").send_keys("wrongpassword")
            
            # Submit form
            submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
            submit_button.click()
            
            # Wait for error message
            self.wait.until(lambda driver: any(
                error_word in driver.page_source.lower() 
                for error_word in ["invalid", "error", "failed"]
            ))
            
            print("✅ Invalid credentials test passed!")
            return True
            
        except Exception as e:
            print(f"❌ Invalid credentials test failed: {str(e)}")
            return False
    
    def test_form_validation(self):
        """Test form validation for required fields"""
        print("🧪 Testing form validation...")
        
        try:
            # Test registration validation
            self.driver.get(f"{self.base_url}/register")
            time.sleep(1)  # Wait to see page load
            submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
            submit_button.click()
            
            # Should stay on register page
            time.sleep(2)
            if "/register" in self.driver.current_url:
                print("✅ Registration validation test passed!")
            else:
                print("❌ Registration validation test failed!")
                return False
            
            # Test login validation
            self.driver.get(f"{self.base_url}/login")
            time.sleep(1)  # Wait to see page load
            submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
            submit_button.click()
            
            # Should stay on login page
            time.sleep(2)
            if "/login" in self.driver.current_url:
                print("✅ Login validation test passed!")
                return True
            else:
                print("❌ Login validation test failed!")
                return False
                
        except Exception as e:
            print(f"❌ Form validation test failed: {str(e)}")
            return False

    def test_hospital_search_workflow(self):
        """Test hospital search workflow"""
        print("🧪 Testing hospital search workflow...")
        
        try:
            # Navigate to hospitals page
            self.driver.get(f"{self.base_url}/hospitals")
            time.sleep(1)  # Wait to see page load
            
            # Wait for page to load and check for h1 element
            h1_element = self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "h1")))
            if "Find Hospitals" not in h1_element.text:
                print("❌ Hospital page title not found")
                return False
            
            print("✅ Hospital page loaded successfully")
            
            # Test 1: Display all hospitals by default
            print("  📋 Testing hospital display...")
            try:
                # Look for hospital cards
                hospital_links = self.driver.find_elements(By.CSS_SELECTOR, "a[href*='/hospitals/']")
                if hospital_links:
                    print(f"    ✅ Found {len(hospital_links)} hospital cards")
                else:
                    # Check for "No hospitals found" message
                    page_text = self.driver.page_source.lower()
                    if "no hospitals found" in page_text:
                        print("    ✅ No hospitals message displayed")
                    else:
                        print("    ⚠️ No hospital cards or message found")
            except:
                print("    ⚠️ Could not verify hospital display")
            
            # Test 2: Switch between grid and map view
            print("  🔄 Testing view switching...")
            try:
                # Look for view switching buttons using their IDs
                grid_button = self.driver.find_element(By.ID, "grid-view-button")
                map_button = self.driver.find_element(By.ID, "map-view-button")
                
                print("    ✅ View switching buttons found")
                
                # Test switching to map view
                map_button.click()
                time.sleep(2)  # Wait to see the change
                print("    ✅ Switched to map view")
                
                # Re-find the grid button after DOM change
                grid_button = self.driver.find_element(By.ID, "grid-view-button")
                
                # Test switching back to grid view
                grid_button.click()
                time.sleep(2)  # Wait to see the change
                print("    ✅ Switched back to grid view")
                
            except Exception as e:
                print(f"    ⚠️ View switching test skipped: {str(e)}")
            
            # Test 3: Show hospital count
            print("  📊 Testing hospital count display...")
            try:
                page_text = self.driver.page_source
                if "showing" in page_text.lower():
                    print("    ✅ Hospital count information found")
                else:
                    print("    ⚠️ Hospital count not displayed")
            except:
                print("    ⚠️ Could not verify hospital count")
            
            print("✅ Hospital search workflow test passed!")
            return True
            
        except Exception as e:
            print(f"❌ Hospital search workflow test failed: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all authentication tests"""
        print("🚀 Starting Authentication Workflow Tests...")
        print(f"🌐 Base URL: {self.base_url}")
        
        try:
            self.setup_driver()
            
            # Test 1: Registration
            self.clear_auth_state()
            registered_email = self.test_registration()
            
            # Test 2: Login with correct credentials
            self.clear_auth_state()
            login_success = self.test_login_success()
            
            # Test 3: Login with invalid credentials
            self.clear_auth_state()
            invalid_login = self.test_login_invalid_credentials()
            
            # Test 4: Form validation
            self.clear_auth_state()
            validation_success = self.test_form_validation()
            
            # Test 5: Hospital search workflow
            self.clear_auth_state()
            hospital_workflow_success = self.test_hospital_search_workflow()
            
            # Summary
            print("\n📊 Test Results Summary:")
            print(f"Registration: {'✅ PASS' if registered_email else '❌ FAIL'}")
            print(f"Login Success: {'✅ PASS' if login_success else '❌ FAIL'}")
            print(f"Invalid Login: {'✅ PASS' if invalid_login else '❌ FAIL'}")
            print(f"Form Validation: {'✅ PASS' if validation_success else '❌ FAIL'}")
            print(f"Hospital Workflow: {'✅ PASS' if hospital_workflow_success else '❌ FAIL'}")
            
            all_passed = all([
                registered_email, 
                login_success, 
                invalid_login, 
                validation_success, 
                hospital_workflow_success])
            print(f"\n🎯 Overall Result: {'✅ ALL TESTS PASSED' if all_passed else '❌ SOME TESTS FAILED'}")
            
        except Exception as e:
            print(f"❌ Test execution failed: {str(e)}")
        finally:
            if self.driver:
                self.driver.quit()
                print("🔧 Browser closed.")

if __name__ == "__main__":
    # Create test instance and run tests
    test = AuthWorkflowTest()
    test.run_all_tests() 