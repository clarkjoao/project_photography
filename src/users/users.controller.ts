import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDTO } from './dtos/user.dto'

@Controller('users')
export class UsersController {
    constructor(private service: UsersService) {
    }
    
    @Get('/:id')
    get(@Param() params) {
        return this.service.findById(params.id);
    }
    
    @Post()
    create(@Body() user: UserDTO) {
        return this.service.create(user);
    }

    @Put()
    update(@Body() user: UserDTO) {
        return this.service.update(user);
    }

    @Delete(':id')
    remove(@Param() params) {
        return this.service.remove(params.id);
    }
}
