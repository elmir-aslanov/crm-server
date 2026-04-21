import Teacher from '../models/Teacher.js';

// 1. Yeni müəllim yarat
export const createTeacher = async (req, res) => {
    try {
        const { email } = req.body;
        const existingTeacher = await Teacher.findOne({ email });

        if (existingTeacher) {
            return res.status(400).json({ message: 'Bu email ilə artıq müəllim qeydiyyatdan keçib' });
        }

        const teacher = await Teacher.create(req.body);
        res.status(201).json(teacher);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 2. Bütün müəllimləri gətir
export const getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.status(200).json(teachers);
    } catch (error) {
        res.status(500).json({ message: 'Server xətası', error: error.message });
    }
};

// 3. ID-yə görə müəllimi gətir
export const getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) return res.status(404).json({ message: 'Müəllim tapılmadı' });

        res.status(200).json(teacher);
    } catch (error) {
        res.status(400).json({ message: 'ID formatı yanlışdır' });
    }
};

// 4. Müəllim məlumatlarını yenilə
export const updateTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!teacher) return res.status(404).json({ message: 'Müəllim tapılmadı' });

        res.status(200).json(teacher);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 5. Müəllimi sil
export const deleteTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndDelete(req.params.id);
        if (!teacher) return res.status(404).json({ message: 'Müəllim tapılmadı' });

        res.status(200).json({ message: 'Müəllim uğurla silindi' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};