import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    UseGuards,
    // Post,
} from '@nestjs/common';
//import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';


@ApiBearerAuth()
@ApiTags("Users")
//@UseGuards(AuthGuard) a remettre lors de la phase sécurisation de l'appli
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    // @Post()
    // create(@Body() createUserDto: CreateUserDto) {
    //   return this.usersService.create(createUserDto);
    // }

    @Get()
    async findAll(): Promise<User[]> {
        return await this.usersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<User> {
        return await this.usersService.findOneById(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() data: UpdateUserDto): Promise<User> {
        return await this.usersService.update(id, data);
    }

    /* @Delete(':id')
     remove(@Param('id') id: string, @Body() data: CreateUserDto) {
      
         return this.usersService.remove(id);
     }*/
}
