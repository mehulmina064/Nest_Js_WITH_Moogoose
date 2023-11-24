/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import * as jwt from 'jsonwebtoken';
import { NestMiddleware, HttpStatus } from '@nestjs/common';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const { headers } = request;

       // Token Expired Please log in Again or contact admin for new
        if(!headers.authorization){
            throw new HttpException("Access Token Required ", HttpStatus.UNAUTHORIZED);
        }
        else{
        const headerString = headers.authorization.split(' ')[1];
        // console.log("in custom authentication",headerString) 
        let decoded1:any
        jwt.verify(headerString, process.env.JWT_SECRET,function(err, decoded)
        {
          if (err) {
            throw new HttpException("Token Expired Please log in Again or contact admin for new", HttpStatus.UNAUTHORIZED);
          }
          else{
            decoded1=decoded
          }
        })
            return super.canActivate(context); 
        }
      }
    
      handleRequest(err, user, info) {
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
          console.log("err");
          throw err || new UnauthorizedException();
        }
        if(user.isDeleted){
          throw err || new UnauthorizedException('your account was deleted please contact the administrator');
        }
        // console.log("user in auth gourd",user);
        return user;
      }
}
