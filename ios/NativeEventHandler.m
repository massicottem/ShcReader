#import "NativeEventHandler.h"

@implementation NativeEventHandler

RCT_EXPORT_MODULE(NativeEventHandler);

- (NSArray<NSString *> *)supportedEvents {
    return @[@"shcDecoded"];
}

@end
