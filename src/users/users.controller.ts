import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { User } from './schemas/user.schemas';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private service: UsersService) {
    }
    
    @Get('findById/:id')
    get(@Param() params) {
        return this.service.findById(params.id);
    }
    
    @Post()
    create(@Body() user: User) {
        return this.service.create(user);
    }

    @Put()
    update(@Body() user: User) {
        return this.service.update(user);
    }

    @Delete(':id')
    remove(@Param() params) {
        return this.service.remove(params.id);
    }
}
