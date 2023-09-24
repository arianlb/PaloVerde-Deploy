import { CreateUserDto } from "../../src/users/dto/create-user.dto"
import { UpdateUserDto } from "../../src/users/dto/update-user.dto";

export const userTest = {
    _id: '5f8d0a3e9d2d7c5e5c3a3f3d',
    fullName: 'Test Test',
    email: 'test@google.com',
    password: '$2b$10$jkaUiceNaFdTlUF6s6MoUuP0pT/Yn2NqkBGqI9S5822/xBqBsfljm', //-> 123456
    isActive: true,
    roles: ['ROLE_USER'],
}

export const userModelMock = {
    create: jest.fn().mockImplementation((createUserDto: CreateUserDto) => {
        if (createUserDto.email === userTest.email) {
            throw { code: 11000, keyValue: { email: createUserDto.email } };
        }
        return {
            _id: userTest._id,
            fullName: createUserDto.fullName,
            email: createUserDto.email,
            password: createUserDto.password,
            isActive: createUserDto.isActive || true,
            roles: createUserDto.roles,
        }
    }),

    find: jest.fn().mockImplementation(() => {
        return {
            limit: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValueOnce([userTest])
        }
    }),

    findById: jest.fn().mockImplementation((id: string) => {
        if (id !== userTest._id) {
            return { exec: jest.fn().mockResolvedValueOnce(null) };
        }
        return {
            exec: jest.fn().mockResolvedValueOnce(userTest)
        };
    }),

    findByIdAndUpdate: jest.fn().mockImplementation((id: string, updateUserDto: UpdateUserDto) => {
        if (id !== userTest._id) {
            return { exec: jest.fn().mockResolvedValueOnce(null) };
        }
        return {
            exec: jest.fn().mockResolvedValueOnce({ ...userTest, ...updateUserDto })
        };
    }),

    findByIdAndDelete: jest.fn().mockImplementation((id: string) => {
        if (id !== userTest._id) {
            return { exec: jest.fn().mockResolvedValueOnce(null) };
        }
        return {
            exec: jest.fn().mockResolvedValueOnce(userTest)
        };
    })
}