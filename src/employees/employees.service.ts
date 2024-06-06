import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
@Injectable()
export class EmployeesService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createEmployeeDto: CreateEmployeeDto) {
    return this.databaseService.employee.create({ data: createEmployeeDto })
  }

  async findAll(role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
    try {

      if (role) {
        return this.databaseService.employee.findMany({ where: { role, } })
      }
      return this.databaseService.employee.findMany()
    } catch (error) {
      throw new PrismaClientValidationError("error fetching employees", error)
    }
  }

  async findOne(id: number) {
    return this.databaseService.employee.findUnique({ where: { id } })
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return this.databaseService.employee.update({ where: { id }, data: updateEmployeeDto })
  }

  async remove(id: number) {
    return this.databaseService.employee.delete({ where: { id } })
  }
}
