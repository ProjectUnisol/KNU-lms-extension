import * as vscode from 'vscode';
import { Course, CoursesProvider } from "./course/course";
import { Assignment, AssignmentsProvider } from "./assignment/assignment";
import { getCourseList } from './course/getCourseList';
import { getAssignmentList } from './assignment/getAssignmentList';
import { displayAssignmentPage } from './assignment/displayAssignmentPage';
import { SubmissionsProvider } from './submission/submission';

export async function activate(context: vscode.ExtensionContext) {
	let config = vscode.workspace.getConfiguration('knu');
	let token: any = config.get<string>('token') || "";

	let courses: any = await getCourseList();

	const coursesProvider = new CoursesProvider(courses);
	vscode.window.createTreeView('course', {
		treeDataProvider: coursesProvider
	});

	const assignmentsProvider = new AssignmentsProvider([]);
	vscode.window.createTreeView('assignment', {
		treeDataProvider: assignmentsProvider
	});

	const submissionsProvider = new SubmissionsProvider([]);
	vscode.window.createTreeView('submission', {
		treeDataProvider: submissionsProvider
	});

	vscode.commands.registerCommand('course.refreshEntry', async () => {
		courses = await getCourseList();
		coursesProvider.refresh(courses);
	});

	vscode.commands.registerCommand('course.listAssignment', async (course: Course) => {
		const assignments = await getAssignmentList(course.courseId);
		assignmentsProvider.refresh(assignments);
	});

	vscode.commands.registerCommand('assignment.displayAssignmentPage', async (assignment: Assignment) => {
		displayAssignmentPage(assignment);
		vscode.commands.executeCommand('submission.focus');
	});
}

export function deactivate() {}
