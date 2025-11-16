import requests
import json
import time
from colorama import init, Fore, Style

init(autoreset=True)

BASE_URL = "http://localhost:5000"
admin_token = None
student_token = None
teacher_token = None

def print_test(test_name, passed, message=""):
    status = f"{Fore.GREEN}✓ PASS" if passed else f"{Fore.RED}✗ FAIL"
    print(f"{test_name:.<50} {status}")
    if message:
        print(f"  {Fore.YELLOW}{message}")

def test_health_check():
    try:
        response = requests.get(f"{BASE_URL}/")
        passed = response.status_code == 200 and response.json()['success']
        print_test("Health Check", passed)
        return passed
    except Exception as e:
        print_test("Health Check", False, str(e))
        return False

def test_register_admin():
    global admin_token
    try:
        data = {
            "email": f"admin-test-{int(time.time())}@peerview.com",
            "password": "AdminTest123",
            "role": "admin"
        }
        response = requests.post(f"{BASE_URL}/auth/register", json=data)
        result = response.json()
        passed = response.status_code == 201 and result['success']
        if passed:
            admin_token = result['data']['token']
        print_test("Register Admin", passed)
        return passed
    except Exception as e:
        print_test("Register Admin", False, str(e))
        return False

def test_register_teacher():
    global teacher_token
    try:
        data = {
            "email": f"teacher-test-{int(time.time())}@peerview.com",
            "password": "TeacherTest123",
            "role": "teacher"
        }
        response = requests.post(f"{BASE_URL}/auth/register", json=data)
        result = response.json()
        passed = response.status_code == 201 and result['success']
        if passed:
            teacher_token = result['data']['token']
        print_test("Register Teacher", passed)
        return passed
    except Exception as e:
        print_test("Register Teacher", False, str(e))
        return False

def test_register_student():
    global student_token
    try:
        data = {
            "email": f"student-test-{int(time.time())}@peerview.com",
            "password": "StudentTest123",
            "role": "student"
        }
        response = requests.post(f"{BASE_URL}/auth/register", json=data)
        result = response.json()
        passed = response.status_code == 201 and result['success']
        if passed:
            student_token = result['data']['token']
        print_test("Register Student", passed)
        return passed
    except Exception as e:
        print_test("Register Student", False, str(e))
        return False

def test_invalid_login():
    try:
        data = {
            "email": "nonexistent@peerview.com",
            "password": "WrongPassword123"
        }
        response = requests.post(f"{BASE_URL}/auth/login", json=data)
        passed = response.status_code == 401
        print_test("Invalid Login (Should Fail)", passed)
        return passed
    except Exception as e:
        print_test("Invalid Login", False, str(e))
        return False

def test_post_question():
    try:
        headers = {"Authorization": f"Bearer {student_token}"}
        data = {
            "title": "Test Question: Binary Search Implementation",
            "moduleCode": "CS101",
            "questionId": f"test-q-{int(time.time())}",
            "description": "How do I implement binary search in Python?"
        }
        response = requests.post(f"{BASE_URL}/student/question", json=data, headers=headers)
        result = response.json()
        passed = response.status_code == 201 and result['success']
        print_test("Post Question (Student)", passed)
        return passed, data['questionId'] if passed else None
    except Exception as e:
        print_test("Post Question", False, str(e))
        return False, None

def test_get_questions():
    try:
        response = requests.get(f"{BASE_URL}/student/questions")
        result = response.json()
        passed = response.status_code == 200 and result['success']
        print_test("Get All Questions", passed)
        return passed
    except Exception as e:
        print_test("Get All Questions", False, str(e))
        return False

def test_add_answer(question_id):
    try:
        headers = {"Authorization": f"Bearer {teacher_token}"}
        data = {
            "answerText": "Binary search is an efficient algorithm that works by repeatedly dividing the search interval in half. Here's how to implement it in Python...",
            "metadata": {
                "references": ["Introduction to Algorithms"],
                "difficulty": "intermediate"
            }
        }
        response = requests.post(f"{BASE_URL}/teacher/answer/{question_id}", json=data, headers=headers)
        result = response.json()
        passed = response.status_code == 200 and result['success']
        print_test("Add Answer (Teacher)", passed)
        return passed
    except Exception as e:
        print_test("Add Answer", False, str(e))
        return False

def test_admin_get_all():
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/admin/all", headers=headers)
        result = response.json()
        passed = response.status_code == 200 and result['success']
        print_test("Admin Get All Data", passed)
        return passed
    except Exception as e:
        print_test("Admin Get All Data", False, str(e))
        return False

def test_unauthorized_access():
    try:
        response = requests.get(f"{BASE_URL}/admin/all")
        passed = response.status_code == 401
        print_test("Unauthorized Access (Should Fail)", passed)
        return passed
    except Exception as e:
        print_test("Unauthorized Access", False, str(e))
        return False

def test_rate_limiting():
    try:
        headers = {"Authorization": f"Bearer {student_token}"}
        question_count = 0
        
        for i in range(12):
            data = {
                "title": f"Rate Limit Test Question {i}",
                "moduleCode": "TEST",
                "questionId": f"rate-test-{int(time.time())}-{i}",
                "description": "Testing rate limits"
            }
            response = requests.post(f"{BASE_URL}/student/question", json=data, headers=headers)
            if response.status_code == 201:
                question_count += 1
            elif response.status_code == 403:
                break
        
        passed = question_count <= 10
        print_test("Rate Limiting (10 questions/day)", passed, f"Posted {question_count} questions")
        return passed
    except Exception as e:
        print_test("Rate Limiting", False, str(e))
        return False

def main():
    print(f"{Fore.CYAN}{Style.BRIGHT}")
    print("=" * 70)
    print("           PeerView Backend - Integration Tests")
    print("=" * 70)
    print(Style.RESET_ALL)
    
    print(f"\n{Fore.YELLOW}Make sure the server is running: python app.py")
    print(f"{Fore.YELLOW}Testing against: {BASE_URL}\n")
    
    time.sleep(1)
    
    tests = []
    
    print(f"{Fore.CYAN}--- Basic Tests ---")
    tests.append(test_health_check())
    
    print(f"\n{Fore.CYAN}--- Authentication Tests ---")
    tests.append(test_register_admin())
    tests.append(test_register_teacher())
    tests.append(test_register_student())
    tests.append(test_invalid_login())
    tests.append(test_unauthorized_access())
    
    if admin_token and teacher_token and student_token:
        print(f"\n{Fore.CYAN}--- Student Operations ---")
        passed, question_id = test_post_question()
        tests.append(passed)
        tests.append(test_get_questions())
        
        if question_id:
            print(f"\n{Fore.CYAN}--- Teacher Operations ---")
            tests.append(test_add_answer(question_id))
        
        print(f"\n{Fore.CYAN}--- Admin Operations ---")
        tests.append(test_admin_get_all())
        
        print(f"\n{Fore.CYAN}--- Security Tests ---")
        tests.append(test_rate_limiting())
    
    print(f"\n{Fore.CYAN}{Style.BRIGHT}")
    print("=" * 70)
    print("                         Summary")
    print("=" * 70)
    print(Style.RESET_ALL)
    
    passed = sum(tests)
    total = len(tests)
    percentage = (passed / total * 100) if total > 0 else 0
    
    print(f"\n{Fore.CYAN}Tests Passed: {passed}/{total} ({percentage:.1f}%)")
    
    if passed == total:
        print(f"{Fore.GREEN}{Style.BRIGHT}\n✓ All tests passed! API is working correctly.")
    elif passed >= total * 0.8:
        print(f"{Fore.YELLOW}\n⚠ Most tests passed. Check failed tests above.")
    else:
        print(f"{Fore.RED}\n✗ Multiple tests failed. Check server logs and configuration.")
    
    print(Style.RESET_ALL)

if __name__ == '__main__':
    main()
