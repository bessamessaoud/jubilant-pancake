import { validate } from "class-validator";
import { CreateUserDto } from "./create-user.dto";

describe('CreateUserDto', () => {
    let dto = new CreateUserDto();
    beforeEach(() => {
        dto = new CreateUserDto();
        dto.email = 'bessa@gmail.com';
        dto.name = 'bessa';
        dto.password = '14021995Ab*';
    })

    const testPassword = async (password : string, message : string) => {
        dto.password = password;
        const errors = await validate(dto);
        const passwordError = errors.find((error) => error.property === 'password')
        expect(passwordError).not.toBeUndefined();
        const messages = Object.values(passwordError?.constraints ?? {});
        expect(messages).toContain(message)
    }

    it('should validate complete valid data',async () => {
        // 3xA
        // Arrange
        // const dto = new CreateUserDto();

        // Act
        const errors = await validate(dto);
        // Assert
        expect(errors.length).toBe(0);
        
        
    })
    it('should faild on invalid email', async () => {
       
        dto.email = 'bessa.com';
        // Act
        const errors = await validate(dto);

        expect(errors[0].property).toBe('email');
        expect(errors[0].constraints).toHaveProperty('isEmail')
    })

    it('should failed without uppercase letters', async () => {
        await testPassword('14021995','password must have at least one uppercase letter');        
    })

    it('should failed without a number', async () => {
        await testPassword('Aaaabbba','password must have at least a number');        
    })

    it('should failed without a special character', async () => {
        await testPassword('Aaaabbba11','password must have at least one special character');        
    })
})