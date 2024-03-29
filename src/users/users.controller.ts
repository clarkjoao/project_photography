import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Param, 
    Post,
    Put,
    HttpException, 
    HttpStatus,
    UseGuards
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDTO } from './dtos/user.dto'

@Controller('users')
export class UsersController {
    constructor(private service: UsersService) {
    }
    
    @Get(':id')
    async get(@Param('id') id: string): Promise<UserDTO> {

        if (!id) {
            throw new HttpException('Missing ID', HttpStatus.BAD_REQUEST);
        }

        return await this.service.findById(id);
    }
    
    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() user: UserDTO) {
        return await this.service.create(user);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id') id: string, @Body() user: UserDTO) {
        
        if (!id) {
            throw new HttpException('Missing ID', HttpStatus.BAD_REQUEST);
        }
        
        return await this.service.update(id, user);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: string) {
        
        if (!id) {
            throw new HttpException('Missing ID', HttpStatus.BAD_REQUEST);
        }

        return await this.service.remove(id);
    }
}
