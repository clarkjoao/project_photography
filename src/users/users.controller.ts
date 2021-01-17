import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Param, 
    Post,
    Put,
    HttpException, 
    HttpStatus 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDTO } from './dtos/user.dto'

@Controller('users')
export class UsersController {
    constructor(private service: UsersService) {
    }
    
    @Get(':id')
    get(@Param('id') id: string) {

        if (!id) {
            throw new HttpException('Missing ID', HttpStatus.BAD_REQUEST);
        }

        return this.service.findById(id);
    }
    
    @Post()
    create(@Body() user: UserDTO) {
        return this.service.create(user);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() user: UserDTO) {
        if (!id) {
            throw new HttpException('Missing ID', HttpStatus.BAD_REQUEST);
        }
        return this.service.update(id, user);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        if (!id) {
            throw new HttpException('Missing ID', HttpStatus.BAD_REQUEST);
        }
        return this.service.remove(id);
    }
}
