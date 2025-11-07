import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        StudentManagement sm = new StudentManagement();

        while (true) {
            System.out.println("\n--- Student Management System ---");
            System.out.println("1. Add Student");
            System.out.println("2. View Students");
            System.out.println("3. Search Student");
            System.out.println("4. Delete Student");
            System.out.println("5. Exit");
            System.out.print("Enter choice: ");
            int ch = sc.nextInt();

            switch (ch) {
                case 1:
                    System.out.print("Enter ID: ");
                    int id = sc.nextInt();
                    sc.nextLine(); // consume newline
                    System.out.print("Enter Name: ");
                    String name = sc.nextLine();
                    System.out.print("Enter Course: ");
                    String course = sc.nextLine();
                    sm.addStudent(new Student(id, name, course));
                    break;

                case 2: sm.viewStudents(); break;
                case 3:
                    System.out.print("Enter ID to search: ");
                    sm.searchStudent(sc.nextInt());
                    break;

                case 4:
                    System.out.print("Enter ID to delete: ");
                    sm.deleteStudent(sc.nextInt());
                    break;

                case 5:
                    System.out.println("👋 Exiting...");
                    sc.close();
                    System.exit(0);
                    break;

                default:
                    System.out.println("⚠️ Invalid choice! Try again.");
            }
        }
    }
}
