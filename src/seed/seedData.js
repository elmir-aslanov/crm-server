import bcrypt from 'bcrypt';
import User from '../models/Users.js';
import Category from '../models/Category.js';
import Course from '../models/Course.js';
import Lead from '../models/Lead.js';
import Student from '../models/Student.js';
import Group from '../models/Group.js';
import Enrollment from '../models/Enrollment.js';
import PaymentPlan from '../models/PaymentPlan.js';
import Payment from '../models/Payment.js';

const addMonths = (date, months) => {
    const next = new Date(date);
    next.setMonth(next.getMonth() + months);
    return next;
};

const ensureUsers = async () => {
    const adminExists = await User.findOne({ email: 'admin@academy.az' });
    if (adminExists) {
        return;
    }

    const password = await bcrypt.hash('Admin123!', 10);

    const users = [
        { firstName: 'Admin', lastName: 'User', email: 'admin@academy.az', phone: '+994500000001', password, role: 'Admin' },
        { firstName: 'Leyla', lastName: 'Manager', email: 'manager1@academy.az', phone: '+994500000002', password, role: 'Manager' },
        { firstName: 'Ramil', lastName: 'Manager', email: 'manager2@academy.az', phone: '+994500000003', password, role: 'Manager' },
        { firstName: 'Aysel', lastName: 'Teacher', email: 'teacher1@academy.az', phone: '+994500000004', password, role: 'Teacher' },
        { firstName: 'Murad', lastName: 'Teacher', email: 'teacher2@academy.az', phone: '+994500000005', password, role: 'Teacher' },
        { firstName: 'Nigar', lastName: 'Teacher', email: 'teacher3@academy.az', phone: '+994500000006', password, role: 'Teacher' },
        { firstName: 'Samir', lastName: 'Accountant', email: 'accountant@academy.az', phone: '+994500000007', password, role: 'Accountant' },
    ];

    await User.insertMany(users);
};

const ensureCategoriesAndCourses = async () => {
    if (await Category.countDocuments() === 0) {
        const categories = await Category.insertMany([
            { name: 'Proqramlaşdırma', description: 'Software development' },
            { name: 'Dizayn', description: 'UI/UX and graphic design' },
            { name: 'Digital Marketinq', description: 'Marketing and growth' },
            { name: 'Kibertəhlükəsizlik', description: 'Security and defense' },
            { name: 'Analitika', description: 'Data analysis' },
        ]);

        const categoryByName = Object.fromEntries(categories.map((category) => [category.name, category]));

        await Course.insertMany([
            { name: 'JavaScript Proqramlaşdırma', categoryId: categoryByName['Proqramlaşdırma']._id, durationMonths: 6, price: 1200, description: 'JavaScript fundamentals to advanced topics', syllabus: ['JS Basics', 'DOM', 'Async', 'Node.js'] },
            { name: 'UI/UX Dizayn', categoryId: categoryByName['Dizayn']._id, durationMonths: 4, price: 900, description: 'Product and interface design', syllabus: ['Research', 'Wireframes', 'Figma', 'Design Systems'] },
            { name: 'Digital Marketinq', categoryId: categoryByName['Digital Marketinq']._id, durationMonths: 5, price: 1000, description: 'SEO, ads and growth', syllabus: ['SEO', 'Ads', 'Content', 'Analytics'] },
            { name: 'Cybersecurity Basics', categoryId: categoryByName['Kibertəhlükəsizlik']._id, durationMonths: 6, price: 1500, description: 'Security basics and blue team', syllabus: ['Networks', 'Threats', 'Hardening', 'Monitoring'] },
            { name: 'Data Analytics', categoryId: categoryByName['Analitika']._id, durationMonths: 5, price: 1100, description: 'Data analysis and dashboards', syllabus: ['Excel', 'SQL', 'BI', 'Reporting'] },
        ]);
    }
};

const ensureLeadsStudentsGroupsEnrollments = async () => {
    if (await Lead.countDocuments() > 0) {
        return;
    }

    const [manager1, manager2, teacher1, teacher2, teacher3] = await User.find({ role: { $in: ['Manager', 'Teacher'] } }).sort({ role: 1 });
    const courses = await Course.find().sort({ name: 1 });

    const sources = ['Website', 'Phone', 'Facebook', 'Instagram', 'Referral', 'Walk-in'];
    const statuses = ['New', 'Contacted', 'Interested', 'Trial', 'Enrolled', 'Lost'];

    const leads = await Lead.insertMany(
        Array.from({ length: 20 }, (_, index) => ({
            firstName: `Lead${index + 1}`,
            lastName: 'Demo',
            phone: `+994555000${String(index + 1).padStart(3, '0')}`,
            email: `lead${index + 1}@academy.az`,
            courseInterest: courses[index % courses.length]._id,
            source: sources[index % sources.length],
            status: statuses[index % statuses.length],
            assignedTo: index % 2 === 0 ? manager1._id : manager2._id,
            utmSource: index % 2 === 0 ? 'google' : 'instagram',
        }))
    );

    const students = await Student.insertMany(
        leads.slice(0, 10).map((lead, index) => ({
            leadId: lead._id,
            studentCode: `STU-${String(index + 1).padStart(6, '0')}`,
            firstName: lead.firstName,
            lastName: lead.lastName,
            email: lead.email,
            phone: lead.phone,
            status: index % 4 === 0 ? 'Active' : 'Suspended',
        }))
    );

    const groups = await Group.insertMany([
        {
            code: 'PRG-2026-05',
            courseId: courses[0]._id,
            teacherId: teacher1._id,
            startDate: new Date(),
            endDate: addMonths(new Date(), 6),
            schedule: { days: ['Mon', 'Wed', 'Fri'], time: '19:00-21:00' },
            maxCapacity: 15,
            status: 'Active',
            room: 'A-101',
        },
        {
            code: 'DES-2026-05',
            courseId: courses[1]._id,
            teacherId: teacher2._id,
            startDate: new Date(),
            endDate: addMonths(new Date(), 4),
            schedule: { days: ['Tue', 'Thu'], time: '18:00-20:00' },
            maxCapacity: 12,
            status: 'Active',
            room: 'B-202',
        },
    ]);

    for (let index = 0; index < 10; index += 1) {
        const group = index < 5 ? groups[0] : groups[1];
        const student = students[index];
        const enrollment = await Enrollment.create({ studentId: student._id, groupId: group._id });
        const totalAmount = group.courseId.equals(courses[0]._id) ? 1200 : 900;
        const paymentPlan = await PaymentPlan.create({
            enrollmentId: enrollment._id,
            totalAmount,
            discountAmount: index % 3 === 0 ? 100 : 0,
            discountReason: index % 3 === 0 ? 'Early registration' : null,
            netAmount: index % 3 === 0 ? totalAmount - 100 : totalAmount,
            installmentCount: 2,
        });

        await Payment.insertMany([
            { paymentPlanId: paymentPlan._id, amount: paymentPlan.netAmount / 2, dueDate: addMonths(new Date(), 0), paidDate: new Date(), status: 'Paid', paymentMethod: 'Cash', recordedBy: teacher1._id },
            { paymentPlanId: paymentPlan._id, amount: paymentPlan.netAmount / 2, dueDate: addMonths(new Date(), 1), status: 'Pending', paymentMethod: 'Transfer', recordedBy: teacher1._id },
        ]);
    }
};

const seedDatabase = async () => {
    await ensureUsers();
    await ensureCategoriesAndCourses();
    await ensureLeadsStudentsGroupsEnrollments();
};

export default seedDatabase;