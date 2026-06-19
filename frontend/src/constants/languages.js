// ============================================
// FILE: frontend/src/constants/languages.js
// PURPOSE: Defines the languages available in the "Select Language"
// dropdown on the code editor page, along with the default starter
// code shown when a language is selected. The `value` for each
// language MUST match the key used in backend/src/config/languages.js
// so the API call to /api/execute works correctly.
//
// HOW TO ADD A NEW LANGUAGE: add an entry here AND a matching entry
// in backend/src/config/languages.js with the same `value` key.
// ============================================

export const LANGUAGES = [
  {
    value: "cpp",
    label: "C++",
    starterCode: `#include <bits/stdc++.h>
using namespace std;
// Define the main function
int main() {
    cout<<"Hello Muggle!";
    return 0;
}`,
  },
  {
    value: "c",
    label: "C",
    starterCode: `#include <stdio.h>

int main() {
    printf("Hello Muggle!");
    return 0;
}`,
  },
  {
    value: "java",
    label: "Java",
    starterCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello Muggle!");
    }
}`,
  },
  {
    value: "python",
    label: "Python",
    starterCode: `print("Hello Muggle!")`,
  },
  {
    value: "javascript",
    label: "JavaScript",
    starterCode: `console.log("Hello Muggle!");`,
  },
];

export const getLanguageByValue = (value) =>
  LANGUAGES.find((lang) => lang.value === value) || LANGUAGES[0];
