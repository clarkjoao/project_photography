import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDTO } from './dtos/user.dto'

@Controller('users')
export class UsersController {
    constructor(private service: UsersService) {
    }
    
    @Get(':id')
    get(@Param('id') id: string) {
        return this.service.findById(id);
    }
    
    @Post()
    create(@Body() user: UserDTO) {
        return this.service.create(user);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() user: UserDTO) {
        return this.service.update(id, user);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
