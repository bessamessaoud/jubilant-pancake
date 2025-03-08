import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';
import * as bcrypt from 'bcrypt';
jest.mock('bcrypt', () => ({
  hash: jest.fn(), // ✅ Mock hash function
  compare: jest.fn(), // ✅ Mock compare function (if needed)
}));
describe('PasswordService', () => {

  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash password', async () => {
    const mockHash = 'hashed_password';
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);
    const password = 'password'
    const result = await service.hashPassword(password);
    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10)
    expect(result).toBe(mockHash);

  })

  it('should correctly verify password', async () => {
    const mockHash = 'hashed_password';
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const password = 'password'
    const result = await service.verifyPassword(password, mockHash);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, mockHash)
    expect(result).toBe(true);

  })

  it('should fail on verifying password', async () => {
    const mockHash = 'hashed_password';
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    const password = 'password22'
    const result = await service.verifyPassword(password, mockHash);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, mockHash)
    expect(result).toBe(false);

  })
});
