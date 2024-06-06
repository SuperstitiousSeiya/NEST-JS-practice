import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    private users = [
        {
            "id": 1,
            "name": "John Doe",
            "email": "john.doe@example.com",
            "role": "ENGINEER"
        },
        {
            "id": 2,
            "name": "Jane Smith",
            "email": "jane.smith@example.com",
            "role": "INTERN"
        },
        {
            "id": 3,
            "name": "Alice Johnson",
            "email": "alice.johnson@example.com",
            "role": "ADMIN"
        },
        {
            "id": 4,
            "name": "Bob Brown",
            "email": "bob.brown@example.com",
            "role": "ENGINEER"
        },
        {
            "id": 5,
            "name": "Charlie Davis",
            "email": "charlie.davis@example.com",
            "role": "INTERN"
        }
    ]


    findAll(role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
        if (role) {
            const rolesArray = this.users.filter(user => user.role === role)
            if (rolesArray.length === 0) throw new NotFoundException(`No users found with role ${role}`)
            return rolesArray
        }
        return this.users
    }

    findOne(id: number) {
        const user = this.users.find(user => user.id === id)
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`)
        }
        return user
    }


    create(createUserDto: CreateUserDto) {
        const sortedUsers = [...this.users].sort((a, b) => a.id - b.id);
        const newUser = { id: sortedUsers[0].id + 1, ...createUserDto };
        this.users.push(newUser);
        return newUser;
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        this.users = this.users.map(user => {
            if (user.id === id) {
                return { ...user, ...updateUserDto }
            }
            return user
        })
        return this.findOne(id)
    }


    delete(id: number) {
        this.users = this.users.filter(user => user.id !== id)
        return this.findOne(id)
    }

}
